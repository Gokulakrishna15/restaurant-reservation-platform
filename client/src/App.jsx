import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import RestaurantList from './components/RestaurantList';
import ImageUpload from './components/ImageUpload';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-10">
      <h1 className="text-3xl font-bold text-center">Restaurant Reservation Platform</h1>
      <RestaurantList />
      <ReservationForm />
      <ReservationList />
      <ImageUpload />
      <AdminDashboard />
    </div>
  );
}

export default App;