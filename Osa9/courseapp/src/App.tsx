
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground | CoursePartSpecial;



const Header = ({ name }: { name: string }): JSX.Element => {
  return <h1>{name}</h1>;
};

const Part = ({ part }: { part: CoursePart }): JSX.Element => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <b>{part.name} {part.exerciseCount}</b><br/>
          <i>{part.description}</i><br/>
        </div>
      )
      case "group":
        return (
          <div>
            <b>{part.name} {part.exerciseCount}</b><br/>
            project exercises {part.groupProjectCount}<br/>
          </div>
        )
      case "background":
        return (
          <div>
            <b>{part.name} {part.exerciseCount}</b><br/>
            <i>{part.description}</i><br/>
            background material: {part.backgroundMaterial}<br/>
          </div>
        )
        case "special":
          return (
            <div>
              <b>{part.name} {part.exerciseCount}</b><br/>
              <i>{part.description}</i><br/>
              required skills: {part.requirements.join(", ")}<br/>
            </div>
          )
  }
};

const Content = ({ parts }: { parts: CoursePart[] }): JSX.Element => {
  return (
    <div>
      {parts.map(part => <div key={part.name}><Part part={part} /><br/></div>)}
    </div>
  )
};

const Total = ({ parts }: { parts: CoursePart[] }): JSX.Element => {
  return (
    <p>
      Number of exercises {parts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  )
};



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
    },
  ];

  return (
    <div>
      <Header name={courseName} />
      <Content parts={courseParts} />
      <Total parts={courseParts}/>
    </div>
  )
};

export default App;
