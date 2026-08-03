import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Relocations } from './pages/Relocations';
import { RelocationDetail } from './pages/RelocationDetail';
import { NewRelocation } from './pages/NewRelocation';
import { Properties } from './pages/Properties';
import { Vendors } from './pages/Vendors';
import { Utilities } from './pages/Utilities';
import { AddressChange } from './pages/AddressChange';
import { Tasks } from './pages/Tasks';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { Activity } from './pages/Activity';
import { Settings } from './pages/Settings';
import { Intake } from './pages/Intake';
import { MoveDay } from './pages/MoveDay';
import { CityPlaybooks } from './pages/CityPlaybooks';
import { Escalations } from './pages/Escalations';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/intake" element={<Intake />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/relocations" element={<Relocations />} />
          <Route path="/relocations/new" element={<NewRelocation />} />
          <Route path="/relocations/:id" element={<RelocationDetail />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/move-day" element={<MoveDay />} />
          <Route path="/utilities" element={<Utilities />} />
          <Route path="/address-change" element={<AddressChange />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/escalations" element={<Escalations />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/playbooks" element={<CityPlaybooks />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
