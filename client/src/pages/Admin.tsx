import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Users, Globe2, Activity, Shield, CreditCard,
  Plus, Trash2, ToggleLeft, ToggleRight, Search
} from "lucide-react";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [newDomain, setNewDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (!loading && (!isAuthenticated || !isAdmin)) {
      setLocation("/ma-carte");
    }
  }, [loading, isAuthenticated, isAdmin, setLocation]);

  // Queries
  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(undefined, { enabled: isAdmin });
  const { data: usersList, refetch: refetchUsers } = trpc.admin.listUsers.useQuery(undefined, { enabled: isAdmin });
  const { data: domainsList, refetch: refetchDomains } = trpc.admin.listDomains.useQuery(undefined, { enabled: isAdmin });
  const { data: logsList } = trpc.admin.recentLogs.useQuery(undefined, { enabled: isAdmin });

  // Mutations
  const addDomain = trpc.admin.addDomain.useMutation({
    onSuccess: () => {
      toast.success("Domaine ajouté");
      setNewDomain("");
      refetchDomains();
    },
    onError: () => toast.error("Erreur lors de l'ajout"),
  });

  const toggleDomain = trpc.admin.toggleDomain.useMutation({
    onSuccess: () => { refetchDomains(); },
  });

  const deleteDomain = trpc.admin.deleteDomain.useMutation({
    onSuccess: () => {
      toast.success("Domaine supprimé");
      refetchDomains();
    },
  });

  const updateCardStatus = trpc.admin.updateCardStatus.useMutation({
    onSuccess: () => {
      toast.success("Statut mis à jour");
      refetchUsers();
    },
  });

  const updateUserRole = trpc.admin.updateUserRole.useMutation({
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      refetchUsers();
    },
  });

  const filteredUsers = (usersList || []).filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.prenom?.toLowerCase().includes(q) ||
      u.nom?.toLowerCase().includes(q) ||
      u.organisation?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-4 w-40 rounded bg-muted" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Tricolor bar */}
      <div className="tricolor-bar"><div /><div /><div /></div>

      {/* Header */}
      <header className="px-4 py-3 flex items-center justify-between border-b border-border">
        <Button variant="ghost" size="sm" className="h-8 -ml-2" onClick={() => setLocation("/ma-carte")}>
          <ArrowLeft className="w-4 h-4 mr-1" />
          Ma Carte
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm">Administration</span>
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-1 container py-4 sm:py-6 max-w-4xl mx-auto space-y-4">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Utilisateurs", value: stats?.totalUsers ?? 0, icon: Users, color: "text-primary" },
            { label: "Cartes actives", value: stats?.activeCards ?? 0, icon: CreditCard, color: "text-ci-green" },
            { label: "En attente", value: stats?.pendingCards ?? 0, icon: Activity, color: "text-ci-orange" },
            { label: "Inactives", value: stats?.inactiveCards ?? 0, icon: Shield, color: "text-muted-foreground" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-[11px] text-muted-foreground">{stat.label}</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold">{statsLoading ? "—" : stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="users" className="text-xs">
              <Users className="w-3.5 h-3.5 mr-1.5" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="domains" className="text-xs">
              <Globe2 className="w-3.5 h-3.5 mr-1.5" />
              Domaines
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs">
              <Activity className="w-3.5 h-3.5 mr-1.5" />
              Logs
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9 h-10"
              />
            </div>

            <div className="space-y-2">
              {filteredUsers.map((u) => (
                <Card key={u.id} className="overflow-hidden">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">
                            {u.prenom || u.nom ? `${u.prenom || ""} ${u.nom || ""}` : u.name || "Sans nom"}
                          </p>
                          <Badge variant={u.cardStatus === "active" ? "default" : u.cardStatus === "pending" ? "secondary" : "outline"} className="text-[10px] h-5">
                            {u.cardStatus}
                          </Badge>
                          <Badge variant="outline" className="text-[10px] h-5">
                            {u.role}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{u.email || "—"}</p>
                        {u.organisation && <p className="text-xs text-muted-foreground">{u.organisation}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select
                          value={u.cardStatus}
                          onValueChange={(v) => updateCardStatus.mutate({ userId: u.id, status: v as "active" | "inactive" | "pending" })}
                        >
                          <SelectTrigger className="h-8 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Actif</SelectItem>
                            <SelectItem value="pending">Attente</SelectItem>
                            <SelectItem value="inactive">Inactif</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={u.role}
                          onValueChange={(v) => updateUserRole.mutate({ userId: u.id, role: v as "user" | "admin" | "superadmin" })}
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">Agent</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="superadmin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredUsers.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Aucun utilisateur trouvé</p>
              )}
            </div>
          </TabsContent>

          {/* Domains Tab */}
          <TabsContent value="domains" className="space-y-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs font-medium text-muted-foreground mb-3">Ajouter un domaine autorisé</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="exemple.gouv.ci"
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value)}
                    className="h-10 flex-1"
                    onKeyDown={e => {
                      if (e.key === "Enter" && newDomain.length >= 3) {
                        addDomain.mutate({ domaine: newDomain });
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    className="h-10"
                    disabled={newDomain.length < 3 || addDomain.isPending}
                    onClick={() => addDomain.mutate({ domaine: newDomain })}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Ajouter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {(domainsList || []).map((d) => (
                <Card key={d.id}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe2 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{d.domaine}</span>
                      <Badge variant={d.actif ? "default" : "secondary"} className="text-[10px] h-5">
                        {d.actif ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleDomain.mutate({ id: d.id, actif: !d.actif })}
                      >
                        {d.actif ? <ToggleRight className="w-4 h-4 text-ci-green" /> : <ToggleLeft className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => {
                          if (confirm(`Supprimer le domaine ${d.domaine} ?`)) {
                            deleteDomain.mutate({ id: d.id });
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-2">
            {(logsList || []).slice(0, 50).map((log) => (
              <Card key={log.id}>
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-medium">{log.action}</p>
                      {log.details && <p className="text-[11px] text-muted-foreground mt-0.5">{log.details}</p>}
                    </div>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" }) : "—"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {(!logsList || logsList.length === 0) && (
              <p className="text-center text-sm text-muted-foreground py-8">Aucun log récent</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
