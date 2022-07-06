const Course = ({ course }) => 
  <div>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>

const Header = ({ course }) => <h2>{course}</h2>

const Total = ({ parts }) => {
  return (<strong>
      total of {parts.reduce((sum, part) => 
      sum + part.exercises,0)} exercises
    </strong>
  )
}

const Part = ({ part }) => 
  <p>{part.name} {part.exercises}</p>

const Content = ({ parts }) => {
  return (
  parts.map(part => 
    <Part key={part.id} part={part} />)
  )}


export default Course