import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { enrollment, feeDetail } = await request.json()

    // Generate random challan number
    const challanNumber = `CH-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

    const getMonthName = (month: string) => {
      return month.charAt(0).toUpperCase() + month.slice(1)
    }

    // Create professional university-style challan HTML
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fee Challan</title>
  <style>
    @media print { body { margin: 0; padding: 0; } }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: white; color: #000; font-size: 9px; padding: 10mm; }
    .challan-page { width: 100%; max-width: 210mm; margin: 0 auto; }
    .copy-section { border: 2px solid #000; padding: 8px; margin-bottom: 5px; }
    .separator { border-top: 2px dashed #666; margin: 8px 0; text-align: center; position: relative; }
    .separator::after { content: '✂ CUT FROM HERE'; background: white; padding: 0 6px; position: relative; top: -7px; font-size: 7px; color: #666; letter-spacing: 1px; }
    .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 5px; }
    .header h1 { font-size: 16px; font-weight: bold; margin-bottom: 1px; letter-spacing: 1px; }
    .header h2 { font-size: 11px; font-weight: bold; margin-bottom: 1px; }
    .header .copy-label { font-size: 8px; font-weight: bold; padding: 2px 5px; border: 1px solid #000; display: inline-block; margin-top: 3px; }
    .challan-number { background: #f5f5f5; padding: 4px; text-align: center; font-size: 9px; font-weight: bold; margin-bottom: 5px; border: 1px solid #000; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 5px; }
    .info-item { border-bottom: 1px solid #ddd; padding: 2px 0; }
    .info-item.full-width { grid-column: 1 / -1; }
    .info-label { font-size: 7px; color: #666; font-weight: bold; text-transform: uppercase; }
    .info-value { font-size: 9px; color: #000; margin-top: 1px; }
    .amount-box { background: #f9f9f9; border: 1px solid #000; padding: 5px; text-align: center; margin: 5px 0; }
    .amount-box .label { font-size: 8px; color: #666; font-weight: bold; margin-bottom: 2px; }
    .amount-box .amount { font-size: 14px; font-weight: bold; color: #000; }
    .bank-section { background: #fffbeb; border: 1px solid #000; padding: 5px; margin: 5px 0; }
    .bank-section .title { font-size: 9px; font-weight: bold; text-align: center; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 4px; text-transform: uppercase; }
    .bank-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
    .bank-item { font-size: 8px; }
    .bank-item .label { color: #666; font-weight: bold; }
    .bank-item .value { color: #000; margin-top: 1px; }
    .signature-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 12px; }
    .signature-box { text-align: center; border-top: 1px solid #000; padding-top: 3px; }
    .signature-box .label { font-size: 7px; color: #666; font-weight: bold; }
    .footer { margin-top: 5px; padding-top: 4px; border-top: 1px solid #000; text-align: center; font-size: 6px; color: #666; }
    .instructions { background: #f5f5f5; padding: 4px; margin: 5px 0; border-left: 2px solid #000; font-size: 7px; }
    .instructions .title { font-weight: bold; margin-bottom: 2px; font-size: 8px; }
    .instructions ul { margin-left: 10px; margin-top: 2px; }
    .instructions li { margin-bottom: 1px; }
  </style>
</head>
<body>
  <div class="challan-page">
    
    <!-- BANK COPY -->
    <div class="copy-section">
      <div class="header">
        <h1>HATBRAIN</h1>
        <h2>Fee Payment Challan</h2>
        <div class="copy-label">BANK COPY</div>
      </div>
      <div class="challan-number">Challan No: ${challanNumber} | Date: ${new Date().toLocaleDateString()}</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Student Name</div><div class="info-value">${user.name}</div></div>
        <div class="info-item"><div class="info-label">Student ID</div><div class="info-value">${user.id.substring(0, 8).toUpperCase()}</div></div>
        <div class="info-item full-width"><div class="info-label">Course Name</div><div class="info-value">${enrollment.course_title}</div></div>
        <div class="info-item"><div class="info-label">Fee Type</div><div class="info-value">${enrollment.fee_type === 'monthly' ? 'Monthly Fee' : 'Installment'}</div></div>
        <div class="info-item"><div class="info-label">Period</div><div class="info-value">${enrollment.fee_type === 'monthly' ? `${getMonthName(feeDetail.month)} ${feeDetail.year}` : `Installment ${feeDetail.installment_number}`}</div></div>
        <div class="info-item"><div class="info-label">Due Date</div><div class="info-value">${new Date(feeDetail.due_date).toLocaleDateString()}</div></div>
        <div class="info-item"><div class="info-label">Status</div><div class="info-value">${feeDetail.status.toUpperCase()}</div></div>
      </div>
      <div class="amount-box">
        <div class="label">AMOUNT PAYABLE</div>
        <div class="amount">${enrollment.currency} ${feeDetail.amount.toLocaleString()}</div>
      </div>
      ${enrollment.bank_name ? `
      <div class="bank-section">
        <div class="title">Deposit To Following Account</div>
        <div class="bank-grid">
          <div class="bank-item"><div class="label">Bank Name:</div><div class="value">${enrollment.bank_name}</div></div>
          ${enrollment.account_title ? `<div class="bank-item"><div class="label">Account Title:</div><div class="value">${enrollment.account_title}</div></div>` : ''}
          ${enrollment.account_number ? `<div class="bank-item"><div class="label">Account Number:</div><div class="value">${enrollment.account_number}</div></div>` : ''}
          ${enrollment.iban ? `<div class="bank-item"><div class="label">IBAN:</div><div class="value">${enrollment.iban}</div></div>` : ''}
        </div>
      </div>
      ` : ''}
      <div class="signature-section">
        <div class="signature-box"><div class="label">Depositor's Signature</div></div>
        <div class="signature-box"><div class="label">Bank Stamp & Date</div></div>
        <div class="signature-box"><div class="label">Cashier's Signature</div></div>
      </div>
      <div class="footer"><p><strong>HATBRAIN</strong> | Computer Generated Challan</p><p>Generated on ${new Date().toLocaleString()}</p></div>
    </div>

    <!-- SEPARATOR -->
    <div class="separator"></div>

    <!-- STUDENT COPY -->
    <div class="copy-section">
      <div class="header">
        <h1>HATBRAIN</h1>
        <h2>Fee Payment Challan</h2>
        <div class="copy-label">STUDENT COPY</div>
      </div>
      <div class="challan-number">Challan No: ${challanNumber} | Date: ${new Date().toLocaleDateString()}</div>
      <div class="info-grid">
        <div class="info-item"><div class="info-label">Student Name</div><div class="info-value">${user.name}</div></div>
        <div class="info-item"><div class="info-label">Student ID</div><div class="info-value">${user.id.substring(0, 8).toUpperCase()}</div></div>
        <div class="info-item"><div class="info-label">Email</div><div class="info-value">${user.email}</div></div>
        <div class="info-item"><div class="info-label">Category</div><div class="info-value">${enrollment.category}</div></div>
        <div class="info-item full-width"><div class="info-label">Course Name</div><div class="info-value">${enrollment.course_title}</div></div>
        <div class="info-item"><div class="info-label">Fee Type</div><div class="info-value">${enrollment.fee_type === 'monthly' ? 'Monthly Fee' : 'Installment'}</div></div>
        <div class="info-item"><div class="info-label">Period</div><div class="info-value">${enrollment.fee_type === 'monthly' ? `${getMonthName(feeDetail.month)} ${feeDetail.year}` : `Installment ${feeDetail.installment_number}`}</div></div>
        <div class="info-item"><div class="info-label">Due Date</div><div class="info-value">${new Date(feeDetail.due_date).toLocaleDateString()}</div></div>
        <div class="info-item"><div class="info-label">Status</div><div class="info-value">${feeDetail.status.toUpperCase()}</div></div>
      </div>
      <div class="amount-box">
        <div class="label">AMOUNT PAYABLE</div>
        <div class="amount">${enrollment.currency} ${feeDetail.amount.toLocaleString()}</div>
      </div>
      ${enrollment.bank_name ? `
      <div class="bank-section">
        <div class="title">Deposit To Following Account</div>
        <div class="bank-grid">
          <div class="bank-item"><div class="label">Bank Name:</div><div class="value">${enrollment.bank_name}</div></div>
          ${enrollment.account_title ? `<div class="bank-item"><div class="label">Account Title:</div><div class="value">${enrollment.account_title}</div></div>` : ''}
          ${enrollment.account_number ? `<div class="bank-item"><div class="label">Account Number:</div><div class="value">${enrollment.account_number}</div></div>` : ''}
          ${enrollment.iban ? `<div class="bank-item"><div class="label">IBAN:</div><div class="value">${enrollment.iban}</div></div>` : ''}
        </div>
      </div>
      ` : ''}
      ${enrollment.payment_instructions ? `
      <div class="instructions">
        <div class="title">Payment Instructions:</div>
        <ul>${enrollment.payment_instructions.split('\\n').map((line: string) => `<li>${line}</li>`).join('')}</ul>
      </div>
      ` : ''}
      <div class="instructions">
        <div class="title">Important Notes:</div>
        <ul>
          <li>Please keep this challan for your records</li>
          <li>Payment must be made before the due date</li>
          <li>After payment, submit the bank copy to administration</li>
          <li>For queries, contact: support@hatbrain.com</li>
        </ul>
      </div>
      <div class="footer"><p><strong>HATBRAIN</strong> | Computer Generated Challan - No Signature Required</p><p>Generated on ${new Date().toLocaleString()}</p></div>
    </div>

  </div>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="challan-${challanNumber}.html"`
      }
    })

  } catch (error) {
    console.error('Error generating challan:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
