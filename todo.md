# TODO - Refonte CarteCI selon Cahier de Développement

## Phase 1 : Infrastructure
- [x] Upgrade vers web-db-user (backend + BDD + auth)
- [x] Créer les tables : USERS, DOMAINS, LOGS, OTP_CODES
- [x] Configurer la whitelist de domaines (@telecom.gouv.ci, @gouv.ci, @ansut.ci)
- [x] Configurer les rôles (Super Admin ANSUT, Admin Ministère, Agent)

## Phase 2 : Écran 1 - Connexion
- [x] Page de connexion avec auth Manus OAuth
- [x] Vérification domaine contre whitelist (OTP flow)
- [x] Envoi OTP par email via API ANSUT
- [x] Validation OTP et création session

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
- [x] Rate limiting OTP (max 5 tentatives en 5 minutes)

## Phase 8 : Tests
- [x] Tests auth (me, logout)
- [x] Tests card (getMyCard, updateMyCard, getPublicCard)
- [x] Tests admin (stats, listUsers, listDomains, recentLogs, permissions)
- [x] Tests messaging (generateOtpCode, buildOtpEmailHtml, buildOtpSmsContent, credentials)
- [x] Tests OTP (checkDomain, sendEmail, verify, status, permissions)

## OTP via API ANSUT (smsgateway.ablele.net)
- [x] Configurer les secrets ANSUT_GATEWAY_URL, ANSUT_USERNAME, ANSUT_PASSWORD
- [x] Créer le module server/messaging.ts pour l'envoi email via API ANSUT
- [x] Implémenter la génération OTP 6 chiffres et stockage en BDD
- [x] Ajouter les routes tRPC otp.sendEmail et otp.verify
- [x] Créer l'interface frontend de vérification email + saisie OTP
- [x] Intégrer le flux OTP dans le parcours de connexion (après OAuth, avant Ma Carte)
- [x] Écrire les tests vitest pour le module OTP (13 tests)

## Partage réseaux sociaux
- [x] Ajouter bouton de partage LinkedIn dans la page Partage
- [x] Ajouter bouton de partage Twitter (X) dans la page Partage
- [x] Intégrer les icônes et couleurs officielles LinkedIn et Twitter
- [x] Tester les liens de partage sur mobile et desktop

## Métadonnées Open Graph
- [x] Créer une route API serveur pour générer une image OG dynamique par carte (/api/og/:userId)
- [x] Ajouter le middleware SSR pour injecter les balises OG dans le HTML pour les crawlers
- [x] Intégrer les balises Twitter Card (summary_large_image)
- [x] Tests vitest OG (7 tests : SVG, meta, XSS, truncation, tricolor)
- [x] Tests curl : LinkedIn, Twitter, WhatsApp, navigateur normal
