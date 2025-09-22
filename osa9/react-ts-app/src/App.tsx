

interface CourseName {
  name: string;
}

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartWithDescription {
  kind: "special";
  requirements: string[];
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;

interface CourseParts {
  courseParts: CoursePart[]
}

interface TotalExcercises {
  totalExercises: number;
}

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b><br/>
          <i>{part.description}</i>
        </p>
      );
    case "group":
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b><br/>
          Project exercises: {part.groupProjectCount}
        </p>
      );
    case "background":
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b><br/>
          <i>{part.description}</i><br/>
          {part.backgroundMaterial}
        </p>
      );
    case "special":
      return (
        <p>
          <b>{part.name} {part.exerciseCount}</b><br/>
          <i>{part.description}</i><br/>
          required skils: {part.requirements.join(", ")}
        </p>
      );      
    default:
      return assertNever(part);
  }
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Header = (props: CourseName) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
    )
}

const Contents = (props: CourseParts) => {
  return (
    <div>
      {props.courseParts.map((part, i) => (
        <Part key={i} part={part} />
      ))}
    </div>
  );
}

const Total = (props: TotalExcercises) => {
  return (
    <p>
      Number of exercises {props.totalExercises}
    </p>
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header name={courseName}/>
      <Contents courseParts={courseParts}/>
      <Total totalExercises={totalExercises}/>
    </div>
  );
};

export default App;