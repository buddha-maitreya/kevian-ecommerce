import { useAuth } from "../context/AuthContext";

export default function Account() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">My Account</h1>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-500">Name</label>
          <p className="font-medium text-primary">{user.name}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">Email</label>
          <p className="font-medium text-primary">{user.email}</p>
        </div>
        {user.phone && (
          <div>
            <label className="text-sm text-gray-500">Phone</label>
            <p className="font-medium text-primary">{user.phone}</p>
          </div>
        )}
        <div>
          <label className="text-sm text-gray-500">Account Type</label>
          <p>
            <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded font-medium text-sm capitalize">
              {user.role}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
