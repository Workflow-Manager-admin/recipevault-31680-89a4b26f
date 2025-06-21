from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel, Field

# FastAPI app instantiation with OpenAPI metadata for documentation.
app = FastAPI(
    title="RecipeVault API",
    description="API for managing recipes. Supports browsing, searching, adding, editing, and deleting recipes.",
    version="1.0.0",
    openapi_tags=[
        {"name": "recipes", "description": "Recipe browsing, search, add, edit, delete APIs"}
    ]
)

# CORS configuration (allow all origins for development/demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory 'database' as an initial placeholder
RECIPES_DB = {}
NEXT_ID = 1

class RecipeBase(BaseModel):
    title: str = Field(..., description="Recipe title")
    description: Optional[str] = Field(None, description="Short recipe description")
    ingredients: List[str] = Field(default_factory=list, description="List of ingredients")
    instructions: str = Field(..., description="Recipe instructions")
    tags: Optional[List[str]] = Field(default_factory=list, description="Tags for recipe (e.g. vegan, dessert)")

class RecipeCreate(RecipeBase):
    pass

class RecipeUpdate(BaseModel):
    title: Optional[str] = Field(None, description="Recipe title")
    description: Optional[str] = Field(None, description="Short recipe description")
    ingredients: Optional[List[str]] = Field(None, description="List of ingredients")
    instructions: Optional[str] = Field(None, description="Recipe instructions")
    tags: Optional[List[str]] = Field(None, description="Tags for recipe (e.g. vegan, dessert)")

class Recipe(RecipeBase):
    id: int = Field(..., description="Unique recipe identifier")

# PUBLIC_INTERFACE
@app.get("/", tags=["health"])
def health_check():
    """Health check endpoint."""
    return {"message": "Healthy"}

# PUBLIC_INTERFACE
@app.get("/recipes", response_model=List[Recipe], tags=["recipes"], summary="List or search recipes")
def list_recipes(
    q: Optional[str] = Query(None, description="Search term"),
    tag: Optional[str] = Query(None, description="Tag to filter by"),
):
    """
    List all recipes or search by text and tag.
    """
    results = []
    for recipe in RECIPES_DB.values():
        if q and q.lower() not in recipe['title'].lower() and q.lower() not in (recipe.get("description") or "").lower():
            continue
        if tag and tag not in (recipe.get("tags") or []):
            continue
        results.append(recipe)
    return results

# PUBLIC_INTERFACE
@app.post("/recipes", response_model=Recipe, tags=["recipes"], summary="Add a new recipe", status_code=201)
def add_recipe(recipe: RecipeCreate):
    """
    Add a new recipe.
    """
    global NEXT_ID
    rec = recipe.dict()
    rec["id"] = NEXT_ID
    RECIPES_DB[NEXT_ID] = rec
    NEXT_ID += 1
    return rec

# PUBLIC_INTERFACE
@app.get("/recipes/{recipe_id}", response_model=Recipe, tags=["recipes"], summary="Get a recipe")
def get_recipe(recipe_id: int):
    """
    Retrieve a recipe by its ID.
    """
    if recipe_id not in RECIPES_DB:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return RECIPES_DB[recipe_id]

# PUBLIC_INTERFACE
@app.put("/recipes/{recipe_id}", response_model=Recipe, tags=["recipes"], summary="Edit/update a recipe")
def update_recipe(recipe_id: int, updates: RecipeUpdate):
    """
    Edit/update a recipe.
    """
    if recipe_id not in RECIPES_DB:
        raise HTTPException(status_code=404, detail="Recipe not found")
    for key, value in updates.dict(exclude_unset=True).items():
        if value is not None:
            RECIPES_DB[recipe_id][key] = value
    return RECIPES_DB[recipe_id]

# PUBLIC_INTERFACE
@app.delete("/recipes/{recipe_id}", tags=["recipes"], summary="Delete a recipe", status_code=204)
def delete_recipe(recipe_id: int):
    """
    Delete a recipe by its ID.
    """
    if recipe_id not in RECIPES_DB:
        raise HTTPException(status_code=404, detail="Recipe not found")
    del RECIPES_DB[recipe_id]
    return None
