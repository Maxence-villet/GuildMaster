// src/hooks/useRoleGuard.ts
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useRoleGuard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }

    if (user.role === "member") {
      const path = location.pathname.toLowerCase();
      
      const allowedPaths = [
        "/guide/list"
      ];

      const isAllowed = allowedPaths.some(p => 
        path === p || path.startsWith(p + "/") || path.startsWith(p + "?")
      );

      if (!isAllowed) {
        toast.error("Accès refusé – Membres : liste des guides uniquement", {
          duration: 5000,
          position: "top-center",
          style: { background: "#991b1b", color: "white" }
        });
        navigate("/guide/list", { replace: true });
      }
    }

    if (user.role === "lieutenant") {
      const path = location.pathname.toLowerCase();
      if (path.includes("/member/add") || path.includes("/members/add")) {
        toast.error("Seul le leader peut ajouter des membres");
        navigate("/guide/list", { replace: true });
      }
    }

  }, [user, navigate, location]); 
};