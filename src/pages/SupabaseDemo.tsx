import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

export default function SupabaseDemo() {
  const [todos, setTodos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function fetchTodos() {
      try {
        const { data, error } = await supabase.from('todos').select();
        if (error) throw error;
        setTodos(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Supabase Todos Demo</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading todos...</p>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg">
              Error: {error}
              <p className="text-sm mt-2">Make sure you have a 'todos' table in your Supabase project.</p>
            </div>
          ) : todos.length === 0 ? (
            <p className="text-stone-500 italic">No todos found. Add some in your Supabase dashboard!</p>
          ) : (
            <ul className="space-y-2">
              {todos.map((todo) => (
                <li key={todo.id} className="p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center justify-between">
                  <span>{todo.name || todo.title || 'Untitled Todo'}</span>
                  {todo.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Completed</span>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
