'use strict'
window.addEventListener('load', windowLoad)

const html = document.documentElement

function windowLoad() {
	document.addEventListener('click', documentActions)

	const testimonialsBody = document.querySelector('.testimonials__body')
	if (testimonialsBody) {
		new Swiper(testimonialsBody, {
			loop: true,
			slidesPerView: 1,
			spaceBetween: 30,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},
			breakpoints: {
				768: {
					slidesPerView: 2,
				},
			},
		})
	}

	// Поява контенту при скролі (IntersectionObserver)
	const watcherItems = document.querySelectorAll('[data-watch]')
	if (watcherItems.length && 'IntersectionObserver' in window) {
		const watcher = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('_watcher-view')
						watcher.unobserve(entry.target)
					}
				})
			},
			{ threshold: 0.15 }
		)
		watcherItems.forEach((el) => watcher.observe(el))
	}

	html.classList.add('loaded')
}

function documentActions(e) {
	const targetElement = e.target

	if (targetElement.closest('.icon-menu')) {
		const isOpen = html.classList.toggle('menu-open')
		const burger = document.querySelector('.icon-menu')
		if (burger) {
			burger.setAttribute('aria-expanded', String(isOpen))
			burger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu')
		}
	}

	if (targetElement.closest('.menu__link')) {
		html.classList.remove('menu-open')
		const burger = document.querySelector('.icon-menu')
		if (burger) {
			burger.setAttribute('aria-expanded', 'false')
			burger.setAttribute('aria-label', 'Open menu')
			burger.focus()
		}
	}

	if (targetElement.closest('summary')) {
		e.preventDefault()

		const spollerTitle = targetElement.closest('summary')
		const spoller = spollerTitle.closest('details')
		const spollerBody = spollerTitle.nextElementSibling

		!spollerBody.hidden
			? spoller.classList.contains('--active')
				? setTimeout(() => {
						spollerBody.hidden = true
					}, 500)
				: (spollerBody.hidden = true)
			: null

		!spoller.open
			? (spoller.open = true)
			: setTimeout(() => {
					spoller.open = false
				}, 500)

		_slideToggle(spollerBody)

		spoller.classList.toggle('--active')
	}
}

let _slideUp = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide')
		target.style.transitionProperty = 'height, margin, padding'
		target.style.transitionDuration = duration + 'ms'
		target.style.height = `${target.offsetHeight}px`
		target.offsetHeight
		target.style.overflow = 'hidden'
		target.style.height = showmore ? `${showmore}px` : `0px`
		target.style.paddingTop = 0
		target.style.paddingBottom = 0
		target.style.marginTop = 0
		target.style.marginBottom = 0
		window.setTimeout(() => {
			target.hidden = !showmore ? true : false
			!showmore ? target.style.removeProperty('height') : null
			target.style.removeProperty('padding-top')
			target.style.removeProperty('padding-bottom')
			target.style.removeProperty('margin-top')
			target.style.removeProperty('margin-bottom')
			!showmore ? target.style.removeProperty('overflow') : null
			target.style.removeProperty('transition-duration')
			target.style.removeProperty('transition-property')
			target.classList.remove('_slide')
			// Створюємо подію
			document.dispatchEvent(
				new CustomEvent('slideUpDone', {
					detail: {
						target: target,
					},
				})
			)
		}, duration)
	}
}
let _slideDown = (target, duration = 500, showmore = 0) => {
	if (!target.classList.contains('_slide')) {
		target.classList.add('_slide')
		target.hidden = target.hidden ? false : null
		showmore ? target.style.removeProperty('height') : null
		let height = target.offsetHeight
		target.style.overflow = 'hidden'
		target.style.height = showmore ? `${showmore}px` : `0px`
		target.style.paddingTop = 0
		target.style.paddingBottom = 0
		target.style.marginTop = 0
		target.style.marginBottom = 0
		target.offsetHeight
		target.style.transitionProperty = 'height, margin, padding'
		target.style.transitionDuration = duration + 'ms'
		target.style.height = height + 'px'
		target.style.removeProperty('padding-top')
		target.style.removeProperty('padding-bottom')
		target.style.removeProperty('margin-top')
		target.style.removeProperty('margin-bottom')
		window.setTimeout(() => {
			target.style.removeProperty('height')
			target.style.removeProperty('overflow')
			target.style.removeProperty('transition-duration')
			target.style.removeProperty('transition-property')
			target.classList.remove('_slide')
			// Створюємо подію
			document.dispatchEvent(
				new CustomEvent('slideDownDone', {
					detail: {
						target: target,
					},
				})
			)
		}, duration)
	}
}
let _slideToggle = (target, duration = 500) => {
	if (target.hidden) {
		return _slideDown(target, duration)
	} else {
		return _slideUp(target, duration)
	}
}
