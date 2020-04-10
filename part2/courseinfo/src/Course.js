import React from 'react';

const Header = ({title}) => <h1>{title}</h1>;

const Part = (props) => <p>{props.name} {props.num}</p>;

const Content = ({parts}) =><div>{parts.map(part=><Part key={part.id} name={part.name} num={part.exercises} />)}</div>;

const Total = (props) => <p>Number of exercises {props.parts.reduce((a,e)=>a+e.exercises,0)}</p>;

export const Course = ({course}) => {
	return (
		<React.Fragment>
			<Header title={course.name}/>
			<Content parts={course.parts}/>
			<Total parts={course.parts}/>
	    </React.Fragment>
	    );
};