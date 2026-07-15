-- Migration: 002_admin_delete.sql
-- Adiciona política RLS para DELETE na tabela responses
-- Apenas administradores podem excluir respostas

CREATE POLICY "admin delete" ON responses FOR DELETE
  USING (is_admin());
