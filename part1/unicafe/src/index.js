import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, label }) => <button onClick={handleClick}>{label}</button>;

const Stat = ({label, value}) => <tr><td>{label}</td><td>{value}</td></tr>;

const Stats = ({ values }) => {
	const statistics = Object.entries(values);
    const total = Object.values(values).reduce((a, e) => a + e.value, 0);
    return (
        <div>
			<h2>Statistics!</h2>
			{total !== 0 ?
				<table>
					<thead>
						<tr>
							<th>Statistic</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>	
						{statistics.map(e=><Stat key={e[0]} label={e[0]} value={e[1].value}/>)}
						<Stat label="Total" value={total}/>
						<Stat label="Weighted Mean" value={Object.values(values).reduce((a,e)=>a+e.weight*e.value,0)}/>
						{statistics.map(e=><Stat key={e[0]} label={`Percent ${e[0]}`} value={`${e[1].value / total * 100}%`}/>)}
					</tbody>
				</table>
				: <p>No Feedback Given</p>}
		</div>
    );
}


const App = () => {
    // save clicks of each button to own state
    const [good, setGood] = useState({ weight: 1, value: 0 });
    const [neutral, setNeutral] = useState({ weight: 0, value: 0 });
    const [bad, setBad] = useState({ weight: -1, value: 0 });

    const increment = vote => ({ ...vote, value: vote.value + 1 });

    return (
        <div>
		<h1>Give Feedback!</h1>
		<Button handleClick={()=>setGood(increment(good))} label="Good"/>
		<Button handleClick={()=>setNeutral(increment(neutral))} label="Neutral"/>
		<Button handleClick={()=>setBad(increment(bad))} label="Bad"/>
		<Stats values={{'Good':good,'Neutral':neutral,'Bad':bad}}/>
    </div>
    )
}

ReactDOM.render(<App />,
    document.getElementById('root')
)