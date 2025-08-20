"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X, AlertTriangle, Trash2 } from "lucide-react";

interface DeleteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  employeeName: string;
  employeeId: string;
}

export default function DeleteEmployeeModal({ 
  isOpen, 
  onClose, 
  onDelete, 
  employeeName, 
  employeeId 
}: DeleteEmployeeModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(`/api/dashboard/employees/${employeeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete employee');
      }

      toast.success(`Employee ${employeeName} deleted successfully`);
      onDelete(); // Refresh the employee list
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete employee');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Delete Employee
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            disabled={isDeleting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Are you sure?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 dark:text-red-200">
            You are about to delete <strong>{employeeName}</strong>. This will permanently remove:
          </p>
          <ul className="mt-2 text-sm text-red-700 dark:text-red-300 list-disc list-inside space-y-1">
            <li>Employee profile and contact information</li>
            <li>All associated schedules and availability</li>
            <li>Service assignments</li>
            <li>Performance history</li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Employee
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
