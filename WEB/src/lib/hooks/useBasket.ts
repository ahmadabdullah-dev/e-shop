import { useCallback, useEffect, useMemo, useState } from "react";
import { useCurrentUser } from "./useUser";

export type BasketItem = {
  id: string;
  quantity: number;
};

const BASKET_EVENT = "basket-changed";

const getStorageKey = (userId?: string) => `basket:${userId ?? "guest"}`;

function readBasket(key: string): BasketItem[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as BasketItem[]) : [];
  } catch {
    return [];
  }
}

function writeBasket(key: string, items: BasketItem[]) {
  localStorage.setItem(key, JSON.stringify(items));
  window.dispatchEvent(new Event(BASKET_EVENT));
}

export function useBasket() {
  const { data: currentUser, isLoading: isUserLoading } = useCurrentUser();
  const storageKey = getStorageKey(currentUser?.id);

  // bump this to force a re-read from localStorage
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const sync = () => setVersion((v) => v + 1);
    window.addEventListener(BASKET_EVENT, sync); // same tab
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(BASKET_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // re-reads whenever the user changes (login/logout) or the basket changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basket = useMemo(() => readBasket(storageKey), [storageKey, version]);

  const addToBasket = useCallback(
    (id: string, quantity = 1) => {
      const current = readBasket(storageKey);
      const existing = current.find((x) => x.id === id);
      if (existing) {
        writeBasket(
          storageKey,
          current.map((x) =>
            x.id === id ? { ...x, quantity: x.quantity + quantity } : x,
          ),
        );
      } else {
        writeBasket(storageKey, [...current, { id, quantity }]);
      }
    },
    [storageKey],
  );

  const setQuantity = useCallback(
    (id: string, quantity: number) => {
      const current = readBasket(storageKey);
      if (quantity <= 0) {
        writeBasket(
          storageKey,
          current.filter((x) => x.id !== id),
        );
        return;
      }
      writeBasket(
        storageKey,
        current.map((x) => (x.id === id ? { ...x, quantity } : x)),
      );
    },
    [storageKey],
  );

  const removeFromBasket = useCallback(
    (id: string) => {
      writeBasket(
        storageKey,
        readBasket(storageKey).filter((x) => x.id !== id),
      );
    },
    [storageKey],
  );

  const getQuantity = useCallback(
    (id: string) => basket.find((x) => x.id === id)?.quantity ?? 0,
    [basket],
  );

  const clearBasket = useCallback(
    () => writeBasket(storageKey, []),
    [storageKey],
  );

  const totalItems = basket.reduce((sum, x) => sum + x.quantity, 0);

  return {
    basket,
    totalItems,
    userId: currentUser?.id,
    isUserLoading,
    addToBasket,
    setQuantity,
    removeFromBasket,
    getQuantity,
    clearBasket,
  };
}
