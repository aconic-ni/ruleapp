import type { Withdrawal } from '@/lib/data';

interface WithdrawalReceiptProps {
    withdrawal: Withdrawal;
}

export default function WithdrawalReceipt({ withdrawal }: WithdrawalReceiptProps) {
    const formattedAmount = withdrawal.amount.toLocaleString('es-ES', { style: 'currency', currency: 'USD' });
    
    return (
        <div className="p-8 sm:p-12 font-sans text-gray-800">
            <div className="space-y-10">
                <div>
                    <h1 className="text-4xl font-bold tracking-wider">ID RETIRO</h1>
                    <p className="text-lg text-gray-500 font-mono pt-2">#{withdrawal.id}</p>
                </div>
                
                <div className="space-y-3 text-base border-t border-b py-6 border-gray-200">
                    <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Fecha:</span>
                        <span>{withdrawal.date}</span>
                    </div>
                     <div className="flex justify-between">
                        <span className="font-semibold text-gray-600">Nombre:</span>
                        <span>{withdrawal.name}</span>
                    </div>
                    <div>
                        <span className="font-semibold text-gray-600">Declaración:</span>
                    </div>
                </div>

                <div className="space-y-3 text-base">
                     <p>Pago aplicado a SolicitudID: <span className="font-mono font-medium ml-2">{withdrawal.solicitudId}</span></p>
                     <p>Por un monto de: <span className="font-bold text-xl ml-2">{formattedAmount}</span></p>
                </div>

                <div className="border rounded-lg p-4 mt-6 border-gray-300 bg-gray-50">
                    <p className="text-sm text-gray-700">
                        {withdrawal.declaration}
                    </p>
                </div>
            </div>
        </div>
    );
}
