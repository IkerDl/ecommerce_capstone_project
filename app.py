from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user


app = Flask(__name__)
CORS(app)
app.config["SQLALCHEMY_DATABASE_URI"] = 'mysql://root:,.password21,.@localhost/ecommerce_data_base'
app.config['SECRET_KEY'] = 'secret_password31'

db = SQLAlchemy(app)
ma = Marshmallow(app)

class Product(db.Model):
    __tablename__ = "products"
    products_id = db.Column(db.Integer, primary_key=True, nullable=False)
    products_name = db.Column(db.String, nullable=False, unique=True)
    products_price = db.Column(db.Integer)
    products_stock = db.Column(db.Integer, default=0)
    products_description = db.Column(db.String)
    products_image = db.Column(db.String)
    products_category_id = db.Column(db.Integer)
    product_carts = relationship('Cart', backref='product')

    def __init__(self,products_name, products_price, products_description, products_image):
        self.products_name = products_name
        self.products_price = products_price
        self.products_stock = products_stock
        self.products_description = products_description
        self.products_image = products_image

class ProductSchema(ma.Schema):
    class Meta:
        fields = ('products_id', 'products_name', 'products_price', 'products_stock', 'products_description', 'products_image', 'products_category_id')

product_schema = ProductSchema()
products_schema = ProductSchema(many=True)
        
class User(db.Model, UserMixin):
    __tablename__ = "users"
    users_id = db.Column(db.Integer, primary_key=True, nullable=False, unique=True)
    users_firstname = db.Column(db.String, nullable=False)
    users_lastname = db.Column(db.String, nullable = False)
    users_email = db.Column(db.String, nullable=False, unique=True)
    users_password = db.Column(db.String, nullable=False)
    users_phone = db.Column(db.Integer, unique=True)
    users_address = db.Column(db.String)
    users_address2 = db.Column(db.String)
    users_country = db.Column(db.String)
    users_zip = db.Column(db.Integer)
    users_city = db.Column(db.String)

    def __init__(self,users_firstname,users_lastname,users_email,users_password):
        self.users_firstname = users_firstname
        self.users_lastname = users_lastname
        self.users_email = users_email
        self.users_password = users_password

class UserSchema(ma.Schema):
    class Meta:
        fields = ('users_id', 'users_firstname', 'users_lastname', 'users_email', 'users_password', 'users_phone', 'users_address','users_address2', 'users_country', 'users_zip', 'users_city')

user_schema = UserSchema()
users_schema = UserSchema(many=True)

class Cart(db.Model):
    __tablename__ = "cart"
    cart_id = db.Column(db.Integer, primary_key=True, nullable=False)
    cart_products_id = db.Column(db.Integer, db.ForeignKey('products.products_id'), nullable=False)
    cart_product = relationship('Product', backref='cart_items')
    cart_products_quantity = db.Column(db.Integer, nullable=False)
    cart_users_id = db.Column(db.Integer, db.ForeignKey('users.users_id'), nullable=False)
    cart_total_price = db.Column(db.Float(precision=2), nullable=False)
    user = relationship("User", backref="carts")

    def __init__(self, cart_products_id, cart_products_quantity, cart_users_id, cart_total_price):
        self.cart_products_id = cart_products_id
        self.cart_products_quantity = cart_products_quantity
        self.cart_users_id = cart_users_id
        self.cart_total_price = cart_total_price

class CartSchema(ma.Schema):
    class Meta:
        fields = ('cart_id', 'cart_products_id', 'cart_products_quantity', 'cart_users_id', 'cart_total_price')

cart_schema = CartSchema()
carts_schema = CartSchema(many=True)


login_manager = LoginManager()
login_manager.login_view = "login"
login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/product/get', methods=["GET"])
def get_products():
    all_products = db.session.query(Product).all()
    result = products_schema.dump(all_products)
    return jsonify(result)

@app.route('/product/get/<id>', methods=["GET"])
def get_product(id):
    get_product = db.session.query(Product).filter(Product.products_id == id).first()
    return jsonify(product_schema.dump(get_product))

@app.route("/product/add", methods=["POST"])
def add_product():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    products_name = post_data.get('products_name')
    products_price = post_data.get('products_price')
    products_description = post_data.get('products_description')
    products_image = post_data.get('products_image')

    new_record = Product(products_name, products_price, products_description,products_image)
    db.session.add(new_record)
    db.session.commit()

    return jsonify(product_schema.dump(new_record))

@app.route("/product/edit/<id>", methods=["PUT"])
def edit_product_id(id):
    if request.content_type != 'application/json':
        return jsonify("Error: Data must be sent as JSON!")
    
    post_data = request.get_json()
    products_name = post_data.get('products_name')
    products_price = post_data.get('products_price')
    products_description = post_data.get('products_description')
    products_image = post_data.get('products_image')

    edit_product_id = db.session.query(Product).filter(Product.products_id == id).first()

    if products_name != None:
        edit_product_id.products_name = products_name
    if products_price != None:
        edit_product_id.products_price = products_price
    if products_description != None:
        edit_product_id.products_description = products_description
    if products_image != None:
        edit_product_id.products_image = products_image

    db.session.commit()
    return jsonify(product_schema.dump(edit_product_id))

@app.route('/product/delete/<id>', methods=["DELETE"])
def delete_product_id(id):
    delete_product = db.session.query(Product).filter(Product.products_id == id).first()
    db.session.delete(delete_product)
    db.session.commit()
    return jsonify("Your product has been deleted!", product_schema.dump(delete_product))

#Get users
@app.route('/user/get', methods=["GET"])
def get_users():
    all_users = db.session.query(User).all()
    result = users_schema.dump(all_users)
    return jsonify(result)
#Get user by id
@app.route('/user/get/<id>', methods=["GET"])
def get_user(id):
    get_user = db.session.query(User).filter(User.users_id == id).first()
    return jsonify(user_schema.dump(get_user))

@app.route("/user/register", methods=["POST"])
def register():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    users_email = post_data.get("users_email")
    users_password = post_data.get("users_password")
    users_firstname = post_data.get("users_firstname")
    users_lastname = post_data.get("users_lastname")

    existing_user = User.query.filter_by(users_email=users_email).first()
    if existing_user:
        return jsonify({'message': 'La dirección de correo electrónico ya está registrada'}), 409


    new_record = User(users_firstname,users_lastname,users_email, users_password)
    db.session.add(new_record)
    db.session.commit()

    return jsonify(user_schema.dump(new_record))

#Login

@app.route("/login", methods=["POST"])
def login():
    if request.content_type != 'application/json':
        return jsonify('Error: Data must be sent as JSON')

    post_data = request.get_json()
    users_email = post_data.get("users_email")
    users_password = post_data.get("users_password")

    user = User.query.filter_by(users_email=users_email).first()

    if user:
        if user.users_password == users_password:
            session["user_id"] = user.users_id
            return jsonify("User logged in")
    
    return jsonify("Invalid email or password")

#Logout
@app.route("/logout", methods=["POST"])
def logout():
    session.pop("user_id", None)

    return jsonify("User logged out")

# Ruta para obtener todos los carritos
@app.route('/carts', methods=["GET"])
def get_all_carts():
    all_carts = db.session.query(Cart).all()
    result = carts_schema.dump(all_carts)
    return jsonify(result)

#Ver los productos de un carrito por su id.

@app.route('/cart/get/<int:cart_id>', methods=["GET"])
def get_cart_items(cart_id):
    cart_items = db.session.query(Cart).filter(Cart.cart_id == cart_id).all()

    if not cart_items:
        return jsonify("Carrito no encontrado"), 404

    cart_products = []
    for cart_item in cart_items:
        product = db.session.query(Product).filter(Product.products_id == cart_item.cart_products_id).first()
        if product:
            cart_product_data = {
                'product_id': product.products_id,
                'product_name': product.products_name,
                'product_price': product.products_price,
                'quantity': cart_item.cart_products_quantity,
                'total_price': cart_item.cart_total_price
            }
            cart_products.append(cart_product_data)

    return jsonify(cart_products)

#Editar la cantidad de productos en ese carrito

@app.route('/cart/edit/<int:cart_id>/<int:product_id>', methods=["PUT"])
def edit_cart_item_quantity(cart_id, product_id):
    if request.content_type != 'application/json':
        return jsonify("Error: Los datos deben enviarse en formato JSON!")

    post_data = request.get_json()
    new_quantity = post_data.get('new_quantity')

    cart_item = db.session.query(Cart).filter(Cart.cart_id == cart_id, Cart.cart_products_id == product_id).first()

    if not cart_item:
        return jsonify("El producto no se encuentra en el carrito o el carrito no existe"), 404

    if new_quantity < 0:
        return jsonify("La cantidad no puede ser negativa"), 400

    cart_item.cart_products_quantity = new_quantity
    
    # Obtener el producto asociado al carrito
    product = cart_item.product

    if product:
        cart_item.cart_total_price = new_quantity * product.products_price
    else:
        # Manejar el escenario donde el producto asociado no es encontrado
        return jsonify("Producto asociado no encontrado"), 404

    db.session.commit()

    return jsonify("Cantidad del producto en el carrito actualizada exitosamente")

#Vaciar carrito
@app.route('/cart/empty/<int:cart_id>', methods=["DELETE"])
def empty_cart(cart_id):
    cart = db.session.query(Cart).filter(Cart.cart_id == cart_id).first()

    if cart:
        db.session.query(Cart).filter(Cart.cart_id == cart_id).delete()
        db.session.commit()
        return jsonify(f"El carrito {cart_id} ha sido vaciado.")
    else:
        return jsonify("Carrito no encontrado.")

#Eliminar un producto del carrito
@app.route('/cart/remove/<int:cart_id>/<int:product_id>', methods=["DELETE"])
def remove_from_cart(cart_id, product_id):
    cart = db.session.query(Cart).filter(Cart.cart_id == cart_id).first()

    if cart:
        cart_item = db.session.query(Cart).filter(Cart.cart_id == cart_id, Cart.cart_products_id == product_id).first()

        if cart_item:
            db.session.delete(cart_item)
            db.session.commit()
            return jsonify(f"Producto {product_id} ha sido eliminado del carrito {cart_id}.")
        else:
            return jsonify(f"Producto {product_id} no encontrado en el carrito {cart_id}.")
    else:
        return jsonify(f"Carrito {cart_id} no encontrado.")

#Añadir producto a un carrito 
@app.route('/cart/add/<int:product_id>', methods=["POST"])
@login_required
def add_to_cart(product_id):
    user_id = current_user.get_id()
    product = db.session.query(Product).filter(Product.products_id == product_id).first()

    if product is None:
        return jsonify("Producto no encontrado"), 404

    cart_item = db.session.query(Cart).filter(Cart.cart_products_id == product_id, Cart.cart_users_id == user_id).first()

    if cart_item:
        cart_item.cart_products_quantity += 1  # Puedes ajustar la cantidad según tus necesidades
        cart_item.cart_total_price = product.products_price * cart_item.cart_products_quantity
    else:
        cart_item = Cart(
            cart_products_id=product.products_id,
            cart_products_quantity=1,  # Puedes ajustar la cantidad según tus necesidades
            cart_users_id=user_id,
            cart_total_price=product.products_price
        )
        db.session.add(cart_item)

    db.session.commit()

    response_data = {
        "message": "Producto agregado al carrito",
        "quantity": cart_item.cart_products_quantity,
        "product_details": {
            "product_id": product.products_id,
            "product_name": product.products_name,
            "product_price": product.products_price
        }
    }

    return jsonify(response_data)


 
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=5000)

