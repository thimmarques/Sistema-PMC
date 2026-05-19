import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Scale } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button, Input, Card } from './ui';

const loginSchema = z.object({
  email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (error) {
      // Error is handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] p-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-gold)] text-white shadow-xl">
            <Scale size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-widest text-[var(--color-chumbo)]">
              LEX AURUM
            </h1>
            <p className="text-xs font-medium tracking-[0.3em] text-[var(--color-gold)] opacity-80">
              ADVOCACIA
            </p>
          </div>
          <p className="mt-6 text-sm text-[var(--color-chumbo)] opacity-60">
            Faça login para acessar o sistema
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[var(--color-chumbo)]">
                Email
              </label>
              <Input
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                error={errors.email?.message}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-[var(--color-chumbo)]">
                  Senha
                </label>
                <a href="#" className="text-xs font-medium text-[var(--color-gold)] hover:underline">
                  Esqueci minha senha
                </a>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
              />
            </div>

            <Button
              type="submit"
              className="w-full mt-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </Card>
        
        <div className="mt-6 text-center text-xs text-[var(--color-chumbo)] opacity-50">
          <p>Credenciais de teste:</p>
          <p>admin@webhubpro.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
