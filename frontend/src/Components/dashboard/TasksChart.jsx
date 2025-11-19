import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function TasksChart({ data }) {
  const chartData = [
    { name: 'Pendiente', cantidad: data.pendiente },
    { name: 'En Progreso', cantidad: data.en_progreso },
    { name: 'Completada', cantidad: data.completada }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="cantidad" fill="#4f46e5" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default TasksChart;