

### Qu'est ce que le chiffrement XOR ? (Définition)

Le chiffrement XOR est une méthode de chiffrement/déchiffrement symétrique basée sur l'utilisation de l'opérateur logique/binaire XOR (aussi appelé Ou Exclusif, symbolisé par ⊕).

Cette technique consiste à combiner chaque bit du message avec un bit de clé, grâce à l'opération XOR.

L'opération XOR prend 2 bits en entrée et renvoie un bit en sortie en fonction de la [table de vérité](https://www.dcode.fr/table-verite-logique) suivante : si les deux bits sont différents, le résultat est 1, sinon le résultat est 0.

### Comment encoder avec XOR ? (Principe de chiffrement)

XOR s'applique sur des données binaires, si le message est un texte, un encodage (conversion en [ASCII](https://www.dcode.fr/code-ascii) ou [Unicode](https://www.dcode.fr/codage-unicode)) doit être réalisé.

Exemple : Chiffrer le message clair 1001 avec la clé 10

Prendre le premier bit du message clair, et le premier bit de la clé et les multiplier avec XOR pour obtenir le bit chiffré.

Exemple : 1 ⊕ 1 = 0

Répéter l'opération avec le second bit du message clair et le second bit de la clé. Arrivé à la fin de la clé, boucler à son début.