import ProductForm from "@/components/ProductForm";
import Layout from "@/components/Layout";

export default function NewProduct() {
  return (
    <Layout>
            <p className="bg-blue-300 p-2 rounded font-bold text-white text-center text-xl mb-3 ">New Product</p>
      <ProductForm />
    </Layout>
  );
}