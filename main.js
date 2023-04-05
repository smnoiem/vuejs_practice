Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true,
            default: false
        }
    },
    template: `
        <div class="product">

            <div class="product-image">
                <img :src="image" alt="">
            </div>

            <div class="product-info">

                <h1>{{ title }}</h1>

                <p v-if="inStock >= 10">In Stock</p>
                <p v-else-if="inStock > 0">Only few items left</p>

                <p :class="{strikethrough: inStock}">Out of Stock</p>

                <p>{{ sale }}</p>

                <p>Shipping : {{ shipping }}</p>

                <product-details :details="details"></product-details>

                <div v-for="(variant, index) in variants" 
                    :key="variant.id"
                    class="color-box"
                    :style="{ backgroundColor: variant.color }"
                    @mouseover="updateProduct(index)">

                </div>

                <button 
                    v-on:click="addToCart" 
                    v-bind:disabled="!inStock"
                    :class="{disabledButton: !inStock}"> Add to Cart</button>

                <button v-on:click="removeFromCart" :disabled="!inStock">Remove From Cart</button>

                <div class="cart">
                    <p>Cart({{ cart }})</p>
                </div>

                <div>
                    <h4>Available Sizes:</h4>
                    <ul>
                        <li v-for="size in sizes">{{ size }}</li>
                    </ul>
                </div>

                <div>
                    <h4>Description:</h4>
                    <p>{{ description }}</p>
                    <a v-show="showLink" :href="link">Go to Mediusware Home</a>
                </div>

            </div>

        </div>
    `,
    data() {
        return {
            product: 'Socks',
            brand: 'Nike',
            selectedVariant: 0,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus, expedita architecto tempora ipsam repellendus illo modi officia esse voluptatibus numquam culpa omnis dolorum ut doloremque cumque impedit libero a quam.",
            link: 'https://www.mediusware.com/',
            showLink: true,
            details: ['80% cotton', '20% polyester', 'unisex'],
            variants: [
                {
                    id: 1,
                    color: 'blue',
                    image: './assets/vmSocks-blue-onWhite.png',
                    quantity: 9,
                },
                {
                    id: 2,
                    color: 'green',
                    image: './assets/vmSocks-green-onWhite.jpg',
                    quantity: 0,
                }
            ],
            sizes: ['S', 'L', 'XL', 'XXL'],
            cart: 0,
            onSale: true
        }
    },
    methods: {
        addToCart: function () {
            this.cart++
        },
        removeFromCart: function () {
            this.cart--
        },
        updateProduct: function (index) {
            this.selectedVariant = index
        }
    },
    computed: {
        title: function () {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedVariant].image
        },
        inStock() {
            return this.variants[this.selectedVariant].quantity
        },
        sale() {
            return this.brand + " " + this.product + " are " + (this.onSale ? 'on sale' : 'not on sale')
        },
        shipping() {
            if(this.premium) return 'Free'
            return 'Paid'
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true,
            default: 'Value for bucks'
        }
    },
    template: `
        <div>
            <h4>Details:</h4>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
        </div>
    `,
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true
    }
})