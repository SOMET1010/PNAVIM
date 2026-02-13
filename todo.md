# TODO - Refonte CarteCI selon Cahier de Développement

## Phase 1 : Infrastructure
- [x] Upgrade vers web-db-user (backend + BDD + auth)
- [x] Créer les tables : USERS, DOMAINS, LOGS, OTP_CODES
- [x] Configurer la whitelist de domaines (@telecom.gouv.ci, @gouv.ci, @ansut.ci)
- [x] Configurer les rôles (Super Admin ANSUT, Admin Ministère, Agent)

## Phase 2 : Écran 1 - Connexion
- [x] Page de connexion avec auth Manus OAuth
- [ ] Vérification domaine contre whitelist (OTP flow à implémenter)
- [ ] Envoi OTP par email
- [ ] Validation OTP et création session

## Phase 3 : Écran 2 - Ma Carte
- [x] Affichage instantané des infos (nom, prénom, fonction, direction, tel, email, photo, QR)
- [x] Édition des informations personnelles
- [x] Export vCard (.vcf) avec +225
- [x] QR Code dynamique (encodage vCard pour enregistrement répertoire)
- [x] Bouton Partager
- [ ] Export PDF haute résolution

## Phase 4 : Écran 3 - Partage
- [x] Copier lien de la carte
- [x] Partage WhatsApp
- [x] Envoi par Email
- [x] QR Code plein écran
- [x] Partage natif (Web Share API)

## Phase 5 : Module Admin
- [x] Dashboard avec indicateurs (total utilisateurs, cartes actives/inactives/en attente)
- [x] Gestion utilisateurs (recherche, modification statut, modification rôle)
- [x] Gestion whitelist domaines (ajout, activation/désactivation, suppression)
- [x] Historique modifications / logs
- [ ] Import CSV utilisateurs

## Phase 6 : Design System Gouvernemental
- [x] Couleurs institutionnelles CI (orange/blanc/vert)
- [x] Typographies validées (DM Sans)
- [x] Template carte de visite gouvernemental
- [x] Conformité design system gouvernemental
- [x] Mobile first, responsive

## Phase 7 : Sécurité
- [x] HTTPS
- [x] Journalisation connexions (table LOGS)
- [x] Logs d'activité
- [ ] Rate limiting OTP

## Phase 8 : Tests
- [x] Tests auth (me, logout)
- [x] Tests card (getMyCard, updateMyCard, getPublicCard)
- [x] Tests admin (stats, listUsers, listDomains, recentLogs, permissions)
