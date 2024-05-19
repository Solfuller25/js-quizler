import fs from 'fs'

const filterRandomElements = numItems => (val, index) => (index < numItems);

const buildAnswerArray = (questionIndex) => (val, idx) => 
  ({ // Choices are repeated numChoices number of times for each question
    type: 'input',
    name: `question-${questionIndex + 1}-choice-${idx + 1}`,
    message: `Enter answer choice ${idx + 1} for question ${questionIndex + 1}`
  })

const buildQuestionArray = (numChoices) => (val, index) => [
  { // Questions are repeated numQuestion number of times
    type: 'input',
    name: `question-${index + 1}`,
    message: `Enter question ${index + 1}`
  },
  [...Array(Number.parseInt(numChoices))].flatMap(buildAnswerArray(Number.parseInt(index)))
]

// chooseRandom : ([Object], number) -> [Object]
export const chooseRandom = (array = [], numItems) => {
  numItems = (1 <= numItems <= array.length && numItems) ? numItems : Math.floor(Math.random(1, array.length + 1));
  return (([...array].length <= 1) ? ([...array]) : ([...array].sort((a,b) => 0.5 - Math.random())).filter(filterRandomElements(numItems)))
}

// createPrompt : (number, number) -> [Object]
export const createPrompt = ({numQuestions = 1, numChoices = 2} = {}) => {
  return [...Array(Number.parseInt(numQuestions))].flatMap(buildQuestionArray(Number.parseInt(numChoices))).flat();
}

// Create blank question with only question title
const createQuestion = (questionTitle, questionMessage) => ({
  type: 'list',
  name: questionTitle,
  message: questionMessage,
  choices: []
})

// createQuestions : ({ string : string, string: string, ... }) -> [Objects]
export const createQuestions = (object = {}) => {
  const questionArray = []
  let questionIndex = ''
  Object.entries(object).forEach(([key, value]) => {
    const inputType = key.split('-')
    if (inputType.length === 2) {
      // This is a question
      questionIndex = key
      questionArray.push(createQuestion(key, value))
    } else {
      // This is an answer
      let question = questionArray.pop()
      question.choices.push(value)
      questionArray.push(question)
    }
  });
  return questionArray;
}

export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

export const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })
