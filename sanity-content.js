/**
 * Henter sideinnstillinger fra Sanity og oppdaterer nettsiden.
 * Kjører etter DOM load. Statisk HTML er fallback hvis Sanity ikke svarer.
 */
(function () {
  const PROJECT_ID = 'yearogd5'
  const DATASET = 'production'
  const API_URL = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}`

  const GROQ = `*[_id == "siteSettings"][0]{
    heroTitle,
    heroDescription,
    hoursTitle,
    hoursSubtitle,
    openingHours[] { day, open, close },
    contactTitle,
    contactSubtitle,
    phone,
    email,
    instagramHandle,
    instagramUrl,
    addressLine1,
    addressLine2,
    mapLink
  }`

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  function setText(id, text) {
    if (!text) return
    const el = document.getElementById(id)
    if (el) el.textContent = text
  }

  function setHtml(id, html) {
    if (html == null) return
    const el = document.getElementById(id)
    if (el) el.innerHTML = html
  }

  function renderHoursList(openingHours) {
    if (!openingHours || openingHours.length === 0) return ''
    return openingHours
      .map(
        (h) =>
          `<div class="hours__item">
            <span class="hours__day">${escapeHtml(h.day || '')}</span>
            <span class="hours__time">${escapeHtml(h.open || '')} - ${escapeHtml(h.close || '')}</span>
          </div>`
      )
      .join('')
  }

  function renderFooterHours(openingHours) {
    if (!openingHours || openingHours.length === 0) return ''
    return openingHours
      .map((h) => `<li>${escapeHtml(h.day || '')}: ${escapeHtml(h.open || '')} - ${escapeHtml(h.close || '')}</li>`)
      .join('')
  }

  function applyData(data) {
    if (!data) return

    setText('sanity-hero-title', data.heroTitle)
    setText('sanity-hero-description', data.heroDescription)

    setText('sanity-hours-title', data.hoursTitle)
    setText('sanity-hours-subtitle', data.hoursSubtitle)
    const hoursHtml = renderHoursList(data.openingHours)
    if (hoursHtml) setHtml('sanity-hours-list', hoursHtml)

    setText('sanity-contact-title', data.contactTitle)
    setText('sanity-contact-subtitle', data.contactSubtitle)

    const phone = data.phone
    if (phone) {
      const phoneEl = document.getElementById('sanity-contact-phone')
      if (phoneEl) {
        const tel = phone.replace(/\s/g, '')
        phoneEl.innerHTML = `<span class="phone-text">${escapeHtml(phone)}</span><a href="tel:${escapeHtml(tel)}" class="contact__link phone-link" style="display: none;">${escapeHtml(phone)}</a>`
      }
    }

    const email = data.email
    if (email) {
      const emailEl = document.getElementById('sanity-contact-email')
      if (emailEl) {
        emailEl.innerHTML = `<span class="email-text">${escapeHtml(email)}</span><a href="mailto:${escapeHtml(email)}" class="contact__link email-link" style="display: none;">${escapeHtml(email)}</a>`
      }
    }

    const igHandle = data.instagramHandle
    const igUrl = data.instagramUrl || (igHandle ? `https://instagram.com/${igHandle.replace(/^@/, '')}` : '')
    if (igHandle || igUrl) {
      const igEl = document.getElementById('sanity-contact-instagram')
      if (igEl) {
        const label = igHandle ? (igHandle.startsWith('@') ? igHandle : '@' + igHandle) : igUrl
        igEl.innerHTML = `<a href="${escapeHtml(igUrl)}" target="_blank" rel="noopener noreferrer" class="contact__link">${escapeHtml(label)}</a>`
      }
    }

    const addr1 = data.addressLine1
    const addr2 = data.addressLine2
    const mapLink = data.mapLink
    if (addr1 || mapLink) {
      const addrEl = document.getElementById('sanity-contact-address')
      if (addrEl) {
        const label = [addr1, addr2].filter(Boolean).join('<br>') || 'Adresse'
        const href = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([addr1, addr2].filter(Boolean).join(', '))}`
        addrEl.innerHTML = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer" class="contact__link">${label}</a>`
      }
    }

    if (data.openingHours && data.openingHours.length > 0) {
      const footerHours = document.getElementById('sanity-footer-hours')
      if (footerHours) footerHours.innerHTML = renderFooterHours(data.openingHours)
    }

    if (phone || email || igUrl || addr1) {
      const footerContact = document.getElementById('sanity-footer-contact')
      if (footerContact) {
        const parts = []
        if (phone) {
          const tel = phone.replace(/\s/g, '')
          parts.push(`<li><i class="fas fa-phone"></i> <a href="tel:${escapeHtml(tel)}">${escapeHtml(phone)}</a></li>`)
        }
        if (email) parts.push(`<li><i class="fas fa-envelope"></i> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></li>`)
        if (igUrl) {
          const igLabel = igHandle ? (igHandle.startsWith('@') ? igHandle : '@' + igHandle) : 'Instagram'
          parts.push(`<li><i class="fab fa-instagram"></i> <a href="${escapeHtml(igUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(igLabel)}</a></li>`)
        }
        if (addr1 || mapLink) {
          const addrText = [addr1, addr2].filter(Boolean).join(', ') || 'Adresse'
          const href = mapLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addrText)}`
          parts.push(`<li><i class="fas fa-map-marker-alt"></i> <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(addrText)}</a></li>`)
        }
        if (parts.length) footerContact.innerHTML = parts.join('')
      }
    }
  }

  function load() {
    const url = API_URL + '?query=' + encodeURIComponent(GROQ)
    fetch(url)
      .then((res) => res.json())
      .then((res) => {
        if (res.result) {
          applyData(res.result)
          document.dispatchEvent(new CustomEvent('sanityContentLoaded'))
        }
      })
      .catch(() => {})
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', load)
  } else {
    load()
  }
})()
