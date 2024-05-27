import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import EmptyState from "@/app/components/EmptyState";

import getListings, { 
  IListingsParams
} from "@/app/actions/getListings";
import getCurrentUser from "@/app/actions/getCurrentUser";
import ClientOnly from "./components/ClientOnly";
import ListingPage from "./components/listings/ListingPage";


interface HomeProps {
  searchParams: IListingsParams
};


const Home = async ( { searchParams }: HomeProps ) => {

  return (
    <ListingPage searchParams={searchParams} />
  )
}

export default Home;
