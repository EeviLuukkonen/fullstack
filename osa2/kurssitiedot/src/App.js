const Header = ({ course }) => <h1>{course}</h1>

const Part = (props) => 
      <p>
        {props.name} {props.exercises}
      </p>

const Content = ({ parts }) => 
    <div>
      {parts.map(part =>
        <Part key={part.id} name={part.name} exercises={part.exercises} />
      )}
    </div>

const Total = (props) => 
      <p>
        Number of exercises {props.parts[0]["exercises"] + props.parts[1]["exercises"] + props.parts[2]["exercises"]}
      </p>


const Course = ({ course }) => {
  return (
    <div>
      <Header course={course["name"]} />
      <Content parts={course["parts"]}/>
    </div>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}


export default App