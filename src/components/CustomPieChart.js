import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if ((percent * 100).toFixed(0) == 0) {
        return (<></>);
    }

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function CustomPieChart(props) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
                <Pie
                    data={props.data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill={props.data.color}
                    dataKey="value"
                >
                    {props.data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={props.data[index % props.data.length].color} />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}

export default CustomPieChart;