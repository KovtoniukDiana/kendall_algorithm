-- CreateTable
CREATE TABLE "Damage" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "Damage_pkey" PRIMARY KEY ("id")
);
