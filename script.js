
const conteneurGrille = document.getElementById('grille');
const affichageTemps = document.getElementById('chrono');
const affichageStatut = document.getElementById('statut');
const boutonDebut = document.getElementById('bouton-debut');
const boutonWiki = document.getElementById('bouton-wiki');


class CAPTCHACarreSequentiel {
	constructor(tailleGrille = 5, nombreCibles = 20) {
		this.tailleGrille = tailleGrille;
		this.nombreCibles = nombreCibles;
		this.timeLimit = 15;
		this.timer = null;
		this.indexCibleCourante = 0;
		this.cellulesCibles = [];
	}

	creerGrille() {
		conteneurGrille.innerHTML = '';
		for (let i = 0; i < this.tailleGrille * this.tailleGrille; i++) {
			const cellule = document.createElement('div');
			cellule.classList.add('case-grille');
			cellule.dataset.index = i;
			cellule.addEventListener('click', this.gererClicCellule.bind(this));
			conteneurGrille.appendChild(cellule);
		}
	}

	demarrerDefi() {
		boutonDebut.style.display = 'none';
		boutonWiki.style.display = 'none';
		this.creerGrille();
		this.cellulesCibles = [];
		this.indexCibleCourante = 0;
		this.demarrerChrono();
		this.afficherPremiereCible();
	}

	afficherPremiereCible() {
		const cellules = document.querySelectorAll('.case-grille');
		const cellulesDisponibles = Array.from(cellules);
		const indexAleatoire = Math.floor(Math.random() * cellulesDisponibles.length);
		const celluleCible = cellulesDisponibles[indexAleatoire];

		celluleCible.classList.add('cible');
		this.cellulesCibles.push(celluleCible);
	}

	afficherCibleSuivante() {
		const cellules = document.querySelectorAll('.case-grille');
		const cellulesDisponibles = Array.from(cellules).filter(cellule =>
			!this.cellulesCibles.includes(cellule)
		);

		if (cellulesDisponibles.length > 0) {
			const indexAleatoire = Math.floor(Math.random() * cellulesDisponibles.length);
			const celluleCible = cellulesDisponibles[indexAleatoire];

			celluleCible.classList.add('cible');
			this.cellulesCibles.push(celluleCible);
		}
	}

	gererClicCellule(event) {
		const celluleCliquee = event.target;

		if (celluleCliquee === this.cellulesCibles[this.indexCibleCourante]) {
			celluleCliquee.classList.remove('cible');
			this.indexCibleCourante++;

			if (this.indexCibleCourante < this.nombreCibles) {
				this.afficherCibleSuivante();
			} else {
				this.finirDefi(true);
			}
		} else if (celluleCliquee.classList.contains('case-grille')) {
			affichageStatut.textContent = 'Mauvais carré ! Réessayez.';
			this.finirDefi(false);
		}
	}

	demarrerChrono() {
		let tempsRestant = this.timeLimit;
		this.timer = setInterval(() => {
			tempsRestant--;
			affichageTemps.textContent = `Temps restant : ${tempsRestant}s | Score : ${this.indexCibleCourante}/${this.nombreCibles}`;

			if (tempsRestant <= 0) {
				this.finirDefi(false);
			}
		}, 1000);
	}

	finirDefi(succes) {
		clearInterval(this.timer);

		if (succes) {
			affichageStatut.textContent = 'CAPTCHA vérifié avec succès !';
			boutonWiki.style.display = 'inline-block';
		} else {
			affichageStatut.textContent = 'Défi échoué. Réessayez !';
			boutonDebut.style.display = 'inline-block';
		}

		this.cellulesCibles.forEach(cellule => cellule.classList.remove('cible'));
		affichageTemps.textContent = `Temps restant: ${this.timeLimit} s`;
	}
}

const captchaCarreSequentiel = new CAPTCHACarreSequentiel();

boutonDebut.addEventListener('click', () => captchaCarreSequentiel.demarrerDefi());
boutonWiki.addEventListener('click', () => {
	const languesWiki = ['fr', 'en', 'es', 'de', 'it', 'pt'];
	const langueAleatoire = languesWiki[Math.floor(Math.random() * languesWiki.length)];
	window.location.href = `https://${langueAleatoire}.wikipedia.org`;
});
