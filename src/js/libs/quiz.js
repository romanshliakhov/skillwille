// Quiz Logic
class Quiz {
	constructor(quizElement) {
		this.quiz = quizElement
		this.steps = Array.from(this.quiz.querySelectorAll("[data-quiz-step]"))
		this.prevBtn = this.quiz.querySelector("[data-quiz-prev]")
		this.nextBtn = this.quiz.querySelector("[data-quiz-next]")
		this.progressLine = this.quiz.querySelector("[data-quiz-progress]")
		this.stepCounter = this.quiz.querySelector("[data-quiz-progress-step]")
		this.tags = Array.from(this.quiz.querySelectorAll(".quiz__tag"))
		this.errorText = this.quiz.dataset.quizError || "Please select an option!"
		this.currentStep = 0
		this.totalSteps = this.steps.length

		this.init()
	}

	init() {
		// Show first step
		this.steps[0].classList.add("_show")
		this.updateQuizState()
		this.updateProgress()

		// Event listeners
		this.prevBtn.addEventListener("click", () => this.prevStep())
		this.nextBtn.addEventListener("click", () => this.nextStep())
	}

	updateQuizState() {
		// Update quiz min/max classes
		this.quiz.classList.remove("_quiz-min", "_quiz-max")

		if (this.currentStep === 0) {
			this.quiz.classList.add("_quiz-min")
		}

		if (this.currentStep === this.totalSteps - 1) {
			this.quiz.classList.add("_quiz-max")
		}
	}

	updateProgress() {
		// Calculate progress percentage
		const progress = this.currentStep === 0 ? 0 : (this.currentStep / this.totalSteps) * 100

		// Update progress bar
		if (this.progressLine) {
			this.progressLine.style.setProperty("--progress-quiz", `${progress}%`)
		}

		// Update step counter
		if (this.stepCounter) {
			this.stepCounter.style.setProperty("--progress-quiz-index", `'${this.currentStep + 1}'`)
			// this.stepCounter.textContent = this.currentStep + 1
		}
	}

	updateTagsCompletion() {
		// Mark tags as complete based on answered questions
		this.steps.forEach((step, index) => {
			// Получаем тег по индексу, а не по названию
			const matchingTag = this.tags[index]

			if (matchingTag) {
				if (index < this.currentStep) {
					// Если шаг пройден (его индекс меньше текущего)
					matchingTag.classList.add("_complete")
				} else {
					// Если шаг не пройден (его индекс больше или равен текущему)
					matchingTag.classList.remove("_complete")
				}
			}
		})
	}

	showError(step) {
		// Remove existing error if any
		const existingError = step.querySelector(".quiz__error")
		if (existingError) {
			existingError.remove()
		}

		// Create and show error message
		const errorElement = document.createElement("div")
		errorElement.className = "quiz__error"
		errorElement.textContent = this.errorText
		step.appendChild(errorElement)
	}

	removeError(step) {
		const errorElement = step.querySelector(".quiz__error")
		if (errorElement) {
			errorElement.remove()
		}
	}

	isStepAnswered(stepIndex) {
		const step = this.steps[stepIndex]
		const radioInputs = step.querySelectorAll('input[type="radio"]')
		return Array.from(radioInputs).some((input) => input.checked)
	}

	nextStep() {
		const currentStepElement = this.steps[this.currentStep]

		// Check if current step is answered
		if (!this.isStepAnswered(this.currentStep)) {
			this.showError(currentStepElement)
			return
		}

		// Remove error if exists
		this.removeError(currentStepElement)

		// If last step, open popup
		if (this.currentStep === this.totalSteps - 1) {
			const popupSelector = this.nextBtn.getAttribute("data-quiz-next")
			if (popupSelector && typeof flsModules !== "undefined" && flsModules.popup) {
				flsModules.popup.open(popupSelector)
			}
			return
		}

		// Move to next step
		currentStepElement.classList.remove("_show")
		this.currentStep++
		this.steps[this.currentStep].classList.add("_show")

		this.updateQuizState()
		this.updateProgress()
		this.updateTagsCompletion()
	}

	prevStep() {
		if (this.currentStep === 0) return

		const currentStepElement = this.steps[this.currentStep]

		// Remove error if exists
		this.removeError(currentStepElement)

		// Move to previous step
		currentStepElement.classList.remove("_show")
		this.currentStep--
		this.steps[this.currentStep].classList.add("_show")

		this.updateQuizState()
		this.updateProgress()
		this.updateTagsCompletion()
	}
}

// Initialize all quizzes on the page
document.addEventListener("DOMContentLoaded", () => {
	const quizElements = document.querySelectorAll("[data-quiz]")
	quizElements.forEach((quizElement) => {
		new Quiz(quizElement)
	})
})
