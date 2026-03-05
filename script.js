const CategoriesContainer = document.getElementById('CategoriesContainer');
const treeContainer = document.getElementById('treeContainer');
const loadingSpiner = document.getElementById('loadingSpiner')
const allTreebtn = document.getElementById('allTreebtn')

//cart section
let cart = []
const cartContainer = document.getElementById('cartContainer')
const TotalAmount=document.getElementById('TotalAmount')
const EmptyCartMessage=document.getElementById('EmptyCartMessage')
//tree Modal
const treeDetailsModal = document.getElementById('tree-details-modal');
const modalTitle = document.getElementById('modalTitle')
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory')
const modalDescription = document.getElementById('modalDescription')
const modalPrice = document.getElementById('modalPrice')

//tree categories
const Categoriesbtn = async () => {
    const res = await fetch('https://openapi.programming-hero.com/api/categories');
    const data = await res.json()
    data.categories.forEach((category) => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-outline  w-full p-1 rounded-md';
        btn.textContent = category.category_name;
        btn.onclick = () => selectCategory(category.id, btn)
        CategoriesContainer.appendChild(btn);
    })
}
Categoriesbtn()

//selectCategory
async function selectCategory(categoryId, btn) {
    showloading()
    console.log(categoryId, btn)
    const allTreebtn = document.querySelectorAll('#CategoriesContainer button, #allTreebtn');
    allTreebtn.forEach((btn) => {
        btn.classList.remove('btn-success')
        btn.classList.add('btn-outline')
    })
    btn.classList.add('btn-success')
    btn.classList.remove('btn-outline')

    const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`,);
    const data = await res.json();
    displayTree(data.plants)
    hiddeLoading()
}

allTreebtn.addEventListener('click', () => {
    const allButton = document.querySelectorAll('#CategoriesContainer button, #allTreebtn');
    allButton.forEach((btn) => {
        btn.classList.remove('btn-success')
        btn.classList.add('btn-outline')
    })
    allTreebtn.classList.add('btn-success')
    allTreebtn.classList.remove('btn-outline')
    treeContainerCard()
})

//loadingSpiner
function showloading() {
    loadingSpiner.classList.remove('hidden')
    treeContainer.innerHTML = '';
}
function hiddeLoading() {
    loadingSpiner.classList.add('hidden')
}

// treeContainer card
const treeContainerCard = async () => {
    showloading()
    const res = await fetch('https://openapi.programming-hero.com/api/plants');
    const data = await res.json();
    displayTree(data.plants)
}
treeContainerCard();


function displayTree(trees) {
    treeContainer.innerHTML = "";
    console.log(trees)
    trees.forEach((card) => {
        const cards = document.createElement('div')
        cards.className = 'card bg-base-100  shadow-sm';
        cards.innerHTML = `
                        <figure>
                            <img src="${card.image}" alt="${card.name}" onclick="opentreeModal(${card.id})" title="${card.name}"
                            class="h-52 w-full object-cover cursor-pointer"
                            />
                        </figure>
                        <div class="card-body">
                            <h2 class="card-title cursor-pointer hover:text-blue-600" onclick="opentreeModal(${card.id})">${card.name}</h2>
                            <p class="line-clamp-2 text-start">${card.description}</p>
                            <div class="badge border border-green-300 text-green-500 rounded-full">${card.category}</div>
                            <div class="card-actions justify-between items-center p-2">
                                <P class="text-red-600 font-bold text-lg">Tk ${card.price}</P>
                                <button class="btn btn-primary" onclick="addToCart(${card.id},'${card.name}',${card.price})">Buy Now</button>
                            </div>
                        </div>
        `
        treeContainer.appendChild(cards)
        hiddeLoading()
    })
}

async function opentreeModal(treeId) {
    console.log(treeId, 'treeId')
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${treeId}`)
    const data = await res.json()
    const plantDetail = data.plants
    console.log(plantDetail)
    modalTitle.textContent = plantDetail.name
    modalImage.src = plantDetail.image
    modalCategory.textContent = plantDetail.category
    modalPrice.textContent = plantDetail.price
    modalDescription.textContent = plantDetail.description
    treeDetailsModal.showModal()
}

//add To Cart

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id == id)
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price,
            quantity: 1,
        });
    }

    updateCart()
}

function updateCart() {
    cartContainer.innerHTML = "";

    if(cart.length===0){
        EmptyCartMessage.classList.remove('hidden')
        TotalAmount.innerText=0;
        return;
    }else{
        EmptyCartMessage.classList.add('hidden')
    }

    let total=0;
    cart.forEach((items) => {
        total+=items.price*items.quantity;
        const cartItems = document.createElement('div')
        cartItems.className = 'card card-body bg-slate-100 font-semibold ';
        cartItems.innerHTML = `<div class="flex justify-between">
                                    <div class="space-y-3">
                                        <p>${items.name}</p>
                                        <p>$${items.price}*${items.quantity}</p>
                                    </div>
                                    <button class="btn btn-ghost font-bold text-red-600" onclick="removeFormCart(${items.id})">X</button>
                                </div>
                                <p class="text-right font-semibold text-xl">$${items.price * items.quantity}</p>
        `; cartContainer.appendChild(cartItems)
    })
    TotalAmount.innerText=total;
}

function removeFormCart(treeId){
    const updateCartElement=cart.filter((items)=>items.id != treeId)
    cart=updateCartElement;
    updateCart()
}



