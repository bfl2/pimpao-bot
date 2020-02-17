export default class Quiz {
	constructor(_question, _correctAnswer, _type) {
		this.question = _question
		this.correctAnswer = _correctAnswer
		this.type = _type
	}

	isAnswerCorrect(answer){
		return this.correctAnswer == answer.toLowerCase()
	}
}