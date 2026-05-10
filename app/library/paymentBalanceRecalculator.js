const db = require("@models");
const {
  getWalletBalance,
  updateWalletRemainingBalance,
} = require("@library/common");

const parseId = (value) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const parseBoolean = (value) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
  }

  return Boolean(value);
};

const normalizeFilters = (filters = {}) => ({
  userId: parseId(filters.userId ?? filters.user_id),
  paymentBy: parseId(filters.paymentBy ?? filters.payment_by),
  paymentId: parseId(filters.paymentId ?? filters.payment_id),
  dryRun: parseBoolean(filters.dryRun ?? filters.dry_run),
});

const recalculatePaymentRemainingBalance = async (filters = {}) => {
  const { userId, paymentBy, paymentId, dryRun } = normalizeFilters(filters);

  const where = {};
  if (userId !== null) {
    where.user_id = userId;
  }
  if (paymentBy !== null) {
    where.payment_by = paymentBy;
  }
  if (paymentId !== null) {
    where.id = paymentId;
  }

  const payments = await db.payments.findAll({
    where,
    order: [["id", "ASC"]],
  });

  const results = [];
  let changedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;

  for (const payment of payments) {
    if (!payment.payment_belongs) {
      skippedCount += 1;
      results.push({
        id: payment.id,
        user_id: payment.user_id,
        payment_by: payment.payment_by,
        payment_belongs: payment.payment_belongs,
        payment_type: payment.payment_type || "wallet",
        skipped: true,
        reason: "missing payment_belongs",
      });
      continue;
    }

    const paymentType = payment.payment_type || "wallet";
    const recalculatedBalance = await getWalletBalance(
      payment.payment_belongs,
      null,
      paymentType,
      payment.id,
    );

    const currentBalance =
      payment.remaining_balance === null ||
      payment.remaining_balance === undefined
        ? null
        : Number(payment.remaining_balance);
    const nextBalance = Number(recalculatedBalance);
    const shouldUpdate = !dryRun && currentBalance !== nextBalance;

    if (shouldUpdate) {
      await updateWalletRemainingBalance(
        payment.payment_belongs,
        payment.id,
        paymentType,
      );
    }

    if (currentBalance === nextBalance) {
      unchangedCount += 1;
    } else {
      changedCount += 1;
    }

    results.push({
      id: payment.id,
      user_id: payment.user_id,
      payment_by: payment.payment_by,
      payment_belongs: payment.payment_belongs,
      payment_type: paymentType,
      status: payment.status,
      amount: payment.amount,
      old_remaining_balance: currentBalance,
      new_remaining_balance: nextBalance,
      updated: shouldUpdate,
    });
  }

  return {
    dry_run: dryRun,
    total: payments.length,
    changed: changedCount,
    unchanged: unchangedCount,
    skipped: skippedCount,
    results,
  };
};

module.exports = {
  recalculatePaymentRemainingBalance,
};
