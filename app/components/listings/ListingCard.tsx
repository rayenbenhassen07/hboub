"use client";
import { useCallback, useMemo } from "react";
import { SafeUser, SafeListing, SafeReservation } from "@/app/types";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Image from "next/image";
import HeartButton from "../HeartButton";
import Button from "../Button";

import axios from "axios";

interface ListingCardProps {
  data: SafeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  user?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  currentUser,
  user,
}) => {
  const router = useRouter();

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    if (reservation) {
      return reservation.totalPrice;
    }
    return data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) {
      return null;
    }
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    return `${format(start, "PP")} - ${format(end, "PP")}`;
  }, [reservation]);

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => router.push(`/listings/${data.id}`)}
        className="
          col-span-1 w-full cursor-pointer group
        "
      >
        <div className="flex flex-col gap-0 w-full">
          <div
            className="
            aspect-square
            w-full
            relative
            overflow-hidden
            rounded-xl
          "
          >
            <Image
              fill
              alt="Listing"
              src={data.images[0]}
              className="
                object-cover
                h-full
                w-full
                group-hover:scale-110
                transition
              "
            />

            <div className="absolute top-3 right-3">
              <HeartButton listingId={data.id} currentUser={currentUser} />
            </div>
          </div>
          <div className="font-bold  pt-1 text-sm">
            {data.title.slice(0, 30)} ...
          </div>
          <div className=" text-sm">Tunisia , {data.locationValue}</div>

          <div className="font-light text-neutral-500 text-sm">
            {reservationDate || data.category}
          </div>
          <div className="flex flex-row items-center gap-1">
            <div className="font-semibold">{price} dt</div>
            {!reservation && <div className="font-light">par nuit</div>}
          </div>
          {onAction && actionLabel && (
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          )}
        </div>
      </div>
      {user && (
        <div>
          <Button
            small
            label="Voir le profil"
            onClick={() => router.push(`/user/${user}`)}
          />
        </div>
      )}
    </div>
  );
};

export default ListingCard;
