// 01
let meals = ['Burger', 'Pizza', 'Donuts', 'Pizza', 'Koshary', 'Donuts', 'Seafood', 'Burger'];

let uniqueMeals = new Set(meals);
console.log('Initial unique meals:', uniqueMeals);

// 02
uniqueMeals.add('Pasta');
console.log('After adding Pasta:', uniqueMeals);

// 03
uniqueMeals.delete('Burger');
console.log('After removing Burger:', uniqueMeals);

// 04
function maybeClearSet(setToCheck) {
    console.log('Before checking size:', setToCheck);
    if (setToCheck.size > 2) {
        setToCheck.clear();
    }
    console.log('After potential clear:', setToCheck);
}

maybeClearSet(uniqueMeals);
