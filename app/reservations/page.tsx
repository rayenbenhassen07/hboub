
import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";

import ReservationsClient from "./ReservationsClient";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly> 
        <EmptyState
          title="Non autorisé"
          subtitle="Veuillez vous connecter"          
        />
      </ClientOnly>
    )
  }

  const reservations = await getReservations({ authorId: currentUser.id });
  

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Aucune réservation trouvée"
          subtitle="Il semble que vous n'avez aucune réservation pour vos propriétés."
          
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
        
      />
    </ClientOnly>
  );
}
 
export default ReservationsPage;
