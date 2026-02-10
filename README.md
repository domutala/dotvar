# dotvar

**dotvar** est une librairie TypeScript permettant de décrire des **modèles de données dynamiques** à partir de **colonnes typées**, avec validation, transformation et métadonnées exploitables côté front et back.

Le projet est pensé pour des applications modernes (Vue, React, NestJS, etc.) qui ont besoin de :
- formulaires dynamiques
- modèles configurables
- validation centralisée
- typage fort de bout en bout

---

## 🎯 Objectif du projet

`dotvar` permet de définir un **modèle métier** comme une liste de colonnes, où chaque colonne décrit :

- le type de donnée (`text`, `number`, `date`, `file`, etc.)
- la clé du champ
- les règles de validation (via **Zod**)
- le comportement métier (sortable, searchable, filterable…)
- la transformation des données entre :
  - le formulaire (input)
  - la base de données
  - la sortie applicative

À partir de cette définition, `dotvar` est capable de :
- générer automatiquement des validateurs Zod
- garantir un typage strict des données
- fournir une structure exploitable pour :
  - formulaires dynamiques
  - APIs
  - back-offices
  - systèmes de configuration

---

## 🧱 Concepts clés

### 1️⃣ Column

Une **Column** représente un champ métier.

Elle définit :
- une clé (`key`)
- un type (`type`)
- un validateur Zod
- des options (optional, nullable, sortable, etc.)
- des hooks de transformation (`submit`, `outputTransform`)

Chaque colonne est fortement typée et responsable de sa propre validation.

---

### 2️⃣ Column factories

`dotvar` fournit des **factory functions** pour créer des colonnes standards :

- `text`
- `paragraph`
- `number`
- `date`
- `dateinterval`
- `time`
- `timeinterval`
- `file`
- `files`
- `avatar`
- `select`
- `selectmultiple`

Ces factories encapsulent les bonnes pratiques de validation et évitent la duplication.

---

### 3️⃣ Model

Un **Model** est une collection de colonnes décrivant une entité métier.

À partir d’un modèle, `dotvar` expose :
- la liste des colonnes instanciées
- un objet de validateurs Zod par clé
- une structure de sortie typée
- des métadonnées exploitables par le front ou le back

---

## ✨ Exemple simple

```ts
import { createModel } from "dotvar";

const userModel = createModel({
  version: 1,
  code: "user",
  columns: [
    {
      type: "text",
      key: "email",
      required: true,
    },
    {
      type: "text",
      key: "name",
    },
    {
      type: "number",
      key: "age",
      optional: true,
    },
  ],
});