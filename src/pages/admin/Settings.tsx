
import React from 'react';
import AdminLayout from '@/components/AdminLayout';

const AdminSettings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-2">
          <div>
            <h3 className="font-medium text-amber-800 mb-1">Store Settings</h3>
            <p className="text-amber-700">
              This feature will be available in the next update. You'll be able to configure store settings, payment methods, shipping options, and more.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
