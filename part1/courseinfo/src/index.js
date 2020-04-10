import React from 'react'
import ReactDOM from 'react-dom'

const Header = ({title}) => <h1>{title}</h1>;

const Part = (props) => <p>{props.name} {props.num}</p>;

const Content = ({parts}) =><div>{parts.map(part=><Part name={part.name} num={part.exercises} />)}</div>;

const Total = (props) => <p>Number of exercises {props.parts.reduce((a,e)=>a+e.exercises,0)}</p>;

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  };

    return (
	    <div>
	      <Header title={course.name}/>
	      <Content parts={course.parts}/>
	      <Total parts={course.parts}/>
		</div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));