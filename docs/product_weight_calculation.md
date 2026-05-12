# 🏋️ Product Weight Calculation — Prakriti API

## Overview

When a product is **created** or **updated**, the system automatically calculates the total weight of the product based on its materials and their respective units. The calculated weight is stored in grams in the `products` table.

---

## 📍 Where It Happens

| File | Location |
|---|---|
| Controller | `app/controllers/superadmin/product.controller.js` |
| Helper | `app/helpers/helper.js` |
| API Route (Store) | `POST /product/store` |
| API Route (Update) | `PUT /product/update/:id` |

---

## ⚙️ How Weight is Calculated (Step by Step)

### Step 1 — Take the First Size's Materials
The system looks at the **first object** in the `size_materials` array sent in the request body:

```js
data.size_materials[0].materials  // Only the first size is used for total weight
```

> ⚠️ **Note:** Weight is calculated using only the **first size group** (`size_materials[0]`), not all sizes. All sizes are saved in the database, but only the first is used for the product-level total weight.

---

### Step 2 — Fetch the Unit for Each Material
For every material in that first size, the unit is fetched from the database:

```js
let unit = await UnitModel.findOne({
  where: { id: data.size_materials[0].materials[i].unit_id },
});
```

---

### Step 3 — Convert Weight to Grams
The function `convertUnitToGram(unitName, weight)` in `app/helpers/helper.js` converts the material weight to grams:

```js
const convertUnitToGram = (unit, weight) => {
  if (isEmpty(weight)) return 0;

  unit = unit.toLowerCase();

  if (unit == "carat" || unit == "carats" || unit == "ct") {
    return weightFormat(parseFloat(weight) / 5);        // 1 Carat = 0.2 grams
  } else if (unit == "ratti" || unit == "rati") {
    return weightFormat(parseFloat(weight) * 0.182);    // 1 Ratti = 0.182 grams
  } else if (unit == "cent") {
    return weightFormat(parseFloat(weight) / 500);      // 1 Cent = 0.002 grams
  } else {
    return weightFormat(weight);                        // Default = grams (no conversion)
  }
};
```

---

### Step 4 — Sum All Material Weights
The converted weights of **all materials** in the first size are summed:

```js
let weight = 0;
if (data.size_materials.length) {
  for (let i = 0; i < data.size_materials[0].materials.length; i++) {
    let unit = await UnitModel.findOne({
      where: { id: data.size_materials[0].materials[i].unit_id },
    });
    weight += convertUnitToGram(
      unit.name,
      data.size_materials[0].materials[i].weight
    );
  }
  weight = weightFormat(weight);  // Format to max 3 decimal places
}
```

---

### Step 5 — Format & Save
The total weight is formatted to **3 decimal places** using `weightFormat()` and saved to the `products` table:

```js
const weightFormat = (p) => {
  p = parseFloat(p).toFixed(3);
  p = p.replace(/[.,]000$/, ""); // Remove trailing .000
  return parseFloat(p);
};
```

---

## 📐 Unit Conversion Table

| Unit Name(s) | Conversion to Grams | Example |
|---|---|---|
| `gram` | × 1 *(no change)* | 10 gram → **10 g** |
| `carat` / `carats` / `ct` | ÷ 5 | 5 carat → **1 g** |
| `ratti` / `rati` | × 0.182 | 10 ratti → **1.82 g** |
| `cent` | ÷ 500 | 500 cent → **1 g** |
| *(any other)* | × 1 *(treated as gram)* | — |

---

## 📦 Example API Request

`POST /api/superadmin/product/store`

```json
{
  "name": "Diamond Ring",
  "category_id": 1,
  "sub_category_id": 2,
  "type": "in_house",
  "status": "active",
  "is_featured": false,
  "certified": false,
  "materials": [2, 3],
  "sizes": [1],
  "certificates": [],
  "tags": ["ring", "diamond"],
  "images": [],
  "main_image": "base64string...",
  "size_materials": [
    {
      "size_id": 1,
      "materials": [
        {
          "material_id": 2,
          "unit_id": 1,
          "weight": "10",
          "quantity": 1,
          "purities": ["18k"]
        },
        {
          "material_id": 3,
          "unit_id": 2,
          "weight": "2",
          "quantity": 1,
          "purities": ["vvs"]
        }
      ]
    }
  ]
}
```

---

## 🧮 Example Weight Calculation

Assuming:
- Material 1 → Unit: **gram**, Weight: `10`
- Material 2 → Unit: **carat**, Weight: `2`

| Material | Unit | Raw Weight | Converted to Grams |
|---|---|---|---|
| Gold | gram | 10 | **10.000 g** |
| Diamond | carat | 2 | **0.4 g** (2 ÷ 5) |
| | | **Total →** | **10.4 g** |

The value `10.4` is stored in `products.weight`.

---

## 🔁 Same Logic on Update

The same weight recalculation happens in `exports.update` (around line 670), using the **same `convertUnitToGram` + `weightFormat`** helpers. Every time a product is updated, the weight is recalculated and overwritten.

---

## 📁 Related Files

| File | Purpose |
|---|---|
| `app/controllers/superadmin/product.controller.js` | Product store/update logic with weight calculation |
| `app/helpers/helper.js` | `convertUnitToGram()` and `weightFormat()` helpers |
| `app/routes/superadmin.routes.js` | Route definitions for `/product/store` and `/product/update/:id` |
| `models/product.js` | Product model — `weight` field |
| `models/product_size_materials.js` | Stores weight per material per size |

---

*Documentation generated from source code — `prakriti_API`*
