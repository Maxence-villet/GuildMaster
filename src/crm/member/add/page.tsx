import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Addmember from "../../../components/Members/Add";
import Header from "../../../components/Header";
import Sidebar from "../../../components/Sidebar";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { getAvailableRoles } from '../../../utils/memberRoles';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRoleGuard } from '../../../hooks/useRoleGuard';

interface member {
  id: number;
  name: string;
  code: string;
  role: 'member' | 'lieutenant' | 'leader';
  clan_id: number;
  created_at: string;
}

export default function AddmemberPage() {
  useRoleGuard();

  const [memberName, setmemberName] = useState('');
  const [memberRole, setmemberRole] = useState('member');
  const [members, setmembers] = useState<member[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchmembers = async () => {
    if (!user?.clan_id) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/members/list?clan_id=${user.clan_id}`);
      setmembers(res.data);
    } catch (err) {
      toast.error("Impossible de charger la liste");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.clan_id) fetchmembers();
  }, [user?.clan_id]);

  useEffect(() => {
    const available = getAvailableRoles(members);
    if (!available.includes(memberRole as any) && available.length > 0) {
      setmemberRole(available[0]);
    }
  }, [members, memberRole]);

  const handleAddmember = async () => {
    if (!memberName.trim()) return toast.error("Nom requis");
    setSubmitting(true);
    try {
      await axios.post(`http://127.0.0.1:8000/members/add`, {
        name: memberName,
        role: memberRole,
        clan_id: user!.clan_id,
      });
      toast.success(`${memberName} ajouté !`);
      setmemberName('');
      fetchmembers();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Erreur");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== "leader") return null;

  const availableRoles = getAvailableRoles(members);

  return (
    <div className="flex flex-col h-screen w-full">
      <Header />
      <div className="flex flex-row h-screen w-full">
        <div className="hidden xl:block"><Sidebar /></div>
        <main className="flex-1 p-2 xl:p-8 max-w-screen-lg mx-auto w-[90%]">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
            <FontAwesomeIcon icon={faPlus} className="text-blue-600" />
            Ajouter un membre
          </h2>
          <div className="w-full mt-4">
            <Toaster />
            <Addmember
              memberName={memberName}
              memberRole={memberRole}
              availableRoles={availableRoles}
              members={members}
              loading={loading}
              submitting={submitting}
              onNameChange={e => setmemberName(e.target.value)}
              onRoleChange={e => setmemberRole(e.target.value)}
              onSubmit={handleAddmember}
            />
          </div>
        </main>
      </div>
    </div>
  );
}