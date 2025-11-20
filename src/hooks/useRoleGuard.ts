import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

export const useRoleGuard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const FORBIDDEN_PATH = "/403"; 

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
        navigate(FORBIDDEN_PATH); 
      }
    }

    if (user.role === "lieutenant") {
      const path = location.pathname.toLowerCase();
      if (path.includes("/member/add") || path.includes("/members/add")) {
        toast.error("Seul le leader peut ajouter des membres");
        navigate(FORBIDDEN_PATH);
      }
    }

  }, [user, navigate, location]); 
};