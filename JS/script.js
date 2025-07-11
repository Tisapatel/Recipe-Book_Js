    let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
 
    function saveRecipes() {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }

    function clearForm() {
      document.getElementById("recipeForm").reset();
    }

    function displayRecipes(list = recipes) {
      const container = document.getElementById("recipeList");
      container.innerHTML = "";

      const cuisines = new Set();

      list.forEach((recipe, index) => {
        cuisines.add(recipe.cuisine);
        const card = document.createElement("div");
        card.className = "col-md-4";
        card.innerHTML = `
          <div class="recipe-card">
            ${recipe.image ? `<img src="${recipe.image}" alt="${recipe.title}" />` : ''}
            <h5>${recipe.title}</h5>
            <p><strong>Cuisine:</strong> ${recipe.cuisine || "N/A"}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Instructions:</strong> ${recipe.instructions}</p>
            <button onclick="editRecipe(${index})" class="btn btn-sm btn-warning">Edit</button>
            <button onclick="deleteRecipe(${index})" class="btn btn-sm btn-danger">Delete</button>
          </div>
        `;
        container.appendChild(card);
      });

      const filterSelect = document.getElementById("filterCuisine");
      filterSelect.innerHTML = '<option value="">Filter by Cuisine</option>';
      cuisines.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        filterSelect.appendChild(opt);
      });
    }

    function addRecipe(e) {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const ingredients = document.getElementById("ingredients").value.trim();
      const instructions = document.getElementById("instructions").value.trim();
      const cuisine = document.getElementById("cuisine").value.trim();
      const image = document.getElementById("image").value.trim();

      if (!title || !ingredients) return alert("Title and Ingredients are required!");

      const recipe = { title, ingredients, instructions, cuisine, image };

      if (editingIndex !== null) {
        recipes[editingIndex] = recipe;
        editingIndex = null;
      } else {
        recipes.push(recipe);
      }

      saveRecipes();
      displayRecipes();
      clearForm();
    }

    let editingIndex = null;

    function editRecipe(index) {
      const r = recipes[index];
      document.getElementById("title").value = r.title;
      document.getElementById("ingredients").value = r.ingredients;
      document.getElementById("instructions").value = r.instructions;
      document.getElementById("cuisine").value = r.cuisine;
      document.getElementById("image").value = r.image || '';
      editingIndex = index;
    }

    function deleteRecipe(index) {
      if (confirm("Delete this recipe?")) {
        recipes.splice(index, 1);
        saveRecipes();
        displayRecipes();
      }
    }

    document.getElementById("recipeForm").addEventListener("submit", addRecipe);

    document.getElementById("search").addEventListener("input", function () {
      const query = this.value.toLowerCase();
      const filtered = recipes.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.ingredients.toLowerCase().includes(query)
      );
      displayRecipes(filtered);
    });

    document.getElementById("filterCuisine").addEventListener("change", function () {
      const val = this.value;
      const filtered = val ? recipes.filter(r => r.cuisine === val) : recipes;
      displayRecipes(filtered);
    });

    displayRecipes();
  