import { useState } from 'react';
import { Plus, Search, CheckSquare } from 'lucide-react';
import { TopNav } from '../components/layout/TopNav';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input, Select, Textarea } from '../components/ui/Input';
import { useStore } from '../store/useStore';
import { taskStatusMap, priorityMap, formatDate, isOverdue } from '../lib/utils';
import { toast } from 'sonner';
import type { Task } from '../types';

function AddTaskModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addTask, relocations, teamMembers } = useStore();
  const [form, setForm] = useState({ relocationId: '', title: '', description: '', assignedToId: 'tm2', dueDate: '', priority: 'medium' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.relocationId) e.relocationId = 'Select a relocation';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.dueDate) e.dueDate = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const relo = relocations.find(r => r.id === form.relocationId);
    const member = teamMembers.find(t => t.id === form.assignedToId);
    const newTask: Task = {
      id: `t${Date.now()}`, relocationId: form.relocationId,
      customerName: relo?.customerName ?? '', title: form.title, description: form.description,
      assignedToId: form.assignedToId, assignedToName: member?.name ?? '',
      dueDate: form.dueDate, status: isOverdue(form.dueDate) ? 'overdue' : 'pending',
      priority: form.priority as Task['priority'], createdAt: new Date().toISOString().split('T')[0],
    };
    addTask(newTask);
    toast.success('Task created');
    onClose();
    setForm({ relocationId: '', title: '', description: '', assignedToId: 'tm2', dueDate: '', priority: 'medium' });
  }

  const activeRelocations = relocations.filter(r => !['completed', 'cancelled'].includes(r.status));

  return (
    <Modal open={open} onClose={onClose} title="Add New Task" size="md"
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button onClick={handleSubmit}>Create Task</Button></>}>
      <div className="space-y-4">
        <Select label="Relocation" value={form.relocationId} onChange={e => setForm(f => ({ ...f, relocationId: e.target.value }))} error={errors.relocationId}
          options={[{ value: '', label: 'Select relocation...' }, ...activeRelocations.map(r => ({ value: r.id, label: `${r.customerName} (${r.fromCity}→${r.toCity})` }))]} />
        <Input label="Task Title" placeholder="e.g. Collect employment letter" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} error={errors.title} />
        <Textarea label="Description (optional)" placeholder="Any additional details..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
        <div className="grid grid-cols-2 gap-3">
          <Select label="Assign To" value={form.assignedToId} onChange={e => setForm(f => ({ ...f, assignedToId: e.target.value }))}
            options={teamMembers.map(t => ({ value: t.id, label: t.name }))} />
          <Select label="Priority" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
            options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} />
        </div>
        <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} error={errors.dueDate} />
      </div>
    </Modal>
  );
}

export function Tasks() {
  const { tasks, updateTask } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [addOpen, setAddOpen] = useState(false);

  const assignees = [...new Set(tasks.map(t => t.assignedToName))];

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchAssignee = assigneeFilter === 'all' || t.assignedToName === assigneeFilter;
    return matchSearch && matchStatus && matchPriority && matchAssignee;
  });

  const counts = {
    overdue: tasks.filter(t => t.status === 'overdue').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  function markComplete(taskId: string) {
    updateTask(taskId, { status: 'completed', completedAt: new Date().toISOString().split('T')[0] });
    toast.success('Task marked as completed');
  }

  function markInProgress(taskId: string) {
    updateTask(taskId, { status: 'in_progress' });
    toast.success('Task moved to In Progress');
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopNav title="Task Management" subtitle={`${filtered.length} tasks`} />
      <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6 space-y-5">

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { key: 'overdue', label: 'Overdue', color: 'text-red-700', bg: 'bg-red-100' },
            { key: 'in_progress', label: 'In Progress', color: 'text-blue-700', bg: 'bg-blue-100' },
            { key: 'pending', label: 'Pending', color: 'text-slate-600', bg: 'bg-slate-100' },
            { key: 'completed', label: 'Completed', color: 'text-green-700', bg: 'bg-green-100' },
          ].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
              className={`p-4 rounded-xl border text-left transition-all ${statusFilter === s.key ? 'border-indigo-400 bg-indigo-50' : 'bg-white border-slate-200 hover:border-slate-300'}`}>
              <p className="text-2xl font-bold text-slate-900">{counts[s.key as keyof typeof counts]}</p>
              <Badge label={s.label} color={s.color} bg={s.bg} />
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 flex-1 min-w-48">
            <Search size={15} className="text-slate-400" />
            <input placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)}
              className="text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none flex-1 bg-transparent" />
          </div>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option><option value="high">High</option>
            <option value="medium">Medium</option><option value="low">Low</option>
          </select>
          <select value={assigneeFilter} onChange={e => setAssigneeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="all">All Assignees</option>
            {assignees.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <Button icon={<Plus size={15} />} onClick={() => setAddOpen(true)}>Add Task</Button>
        </div>

        {/* Task list */}
        <Card padding="none">
          <div className="divide-y divide-slate-50">
            {filtered.map(task => {
              const ts = taskStatusMap[task.status];
              const pm = priorityMap[task.priority];
              return (
                <div key={task.id} className={`px-5 py-4 hover:bg-slate-50 transition-colors ${task.status === 'overdue' ? 'border-l-4 border-l-red-400' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">{task.title}</span>
                        <Badge label={ts.label} color={ts.color} bg={ts.bg} />
                        <Badge label={pm.label} color={pm.color} bg={pm.bg} dot dotColor={pm.dot} />
                      </div>
                      {task.description && <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="text-xs text-indigo-600 font-medium">{task.customerName}</span>
                        <span className="text-xs text-slate-400">→ {task.assignedToName}</span>
                        <span className={`text-xs font-medium ${task.status === 'overdue' ? 'text-red-600' : 'text-slate-500'}`}>
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {task.status === 'pending' || task.status === 'overdue' ? (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => markInProgress(task.id)}>Start</Button>
                          <Button size="sm" variant="secondary" onClick={() => markComplete(task.id)}>Done</Button>
                        </>
                      ) : task.status === 'in_progress' ? (
                        <Button size="sm" variant="secondary" onClick={() => markComplete(task.id)}>Complete</Button>
                      ) : (
                        <span className="text-xs text-green-600 font-medium">✓ Done</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CheckSquare size={48} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400">No tasks match your filters.</p>
            </div>
          )}
        </Card>
      </div>
      <AddTaskModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
