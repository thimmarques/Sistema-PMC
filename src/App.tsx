/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { ClientesPage } from './components/ClientesPage';
import { ClienteDetalhe } from './components/ClienteDetalhe';
import { ProcessosPage } from './components/ProcessosPage';
import { ProcessoDetalhe } from './components/ProcessoDetalhe';
import { FinanceiroPage } from './components/FinanceiroPage';
import { AudienciasPage } from './components/AudienciasPage';
import { ProtectedRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes" 
              element={
                <ProtectedRoute>
                  <ClientesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/clientes/:id" 
              element={
                <ProtectedRoute>
                  <ClienteDetalhe />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processos" 
              element={
                <ProtectedRoute>
                  <ProcessosPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/processos/:id" 
              element={
                <ProtectedRoute>
                  <ProcessoDetalhe />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/financeiro" 
              element={
                <ProtectedRoute>
                  <FinanceiroPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audiencias" 
              element={
                <ProtectedRoute>
                  <AudienciasPage />
                </ProtectedRoute>
              } 
            />
            {/* Redirect all other routes to dashboard if logged in, or login if not */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

