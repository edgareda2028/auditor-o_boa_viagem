import QRCode from 'qrcode';
import { Evento, Inscrito } from '../types';
import logo from '../assets/img/logo.png';

export const generateReceipt = async (evento: Evento, inscrito: Inscrito, onSuccess?: () => void) => {
    const primaryColor = '#004a99';
    const secondaryColor = '#333333';

    if (inscrito.checkedIn) {
        return generateCertificate(evento, inscrito, onSuccess);
    }

    // Generate QR Code for Receipt
    const qrCodeDataUrl = await QRCode.toDataURL(inscrito.qrToken || '', {
        margin: 1,
        width: 400,
        color: {
            dark: primaryColor,
            light: '#ffffff'
        }
    });

    const container = document.createElement('div');
    container.style.cssText = `
        width: 595px;
        min-height: 842px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: 'Inter', Arial, sans-serif;
        padding: 40px;
        box-sizing: border-box;
    `;

    container.innerHTML = `
        <div style="border: 4px solid ${primaryColor}; border-radius: 24px; padding: 0; min-height: 760px; display: flex; flex-direction: column; overflow: hidden;">
            <!-- Header -->
            <div style="background: ${primaryColor}; padding: 40px 30px; text-align: center;">
                <img src="${logo}" style="height: 60px; margin-bottom: 15px; filter: brightness(0) invert(1);" />
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase;">Comprovante de Inscrição</h1>
            </div>

            <div style="padding: 40px; flex-grow: 1;">
                <div style="margin-bottom: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 20px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Evento</p>
                    <h2 style="color: ${primaryColor}; font-size: 22px; font-weight: 900; margin: 0;">${evento.nome}</h2>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                    <div>
                        <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Participante</p>
                        <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${inscrito.nomeCompleto.toUpperCase()}</p>
                    </div>
                    <div>
                        <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">CPF</p>
                        <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${inscrito.cpf || 'N/A'}</p>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Data e Horário</p>
                    <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Local</p>
                    <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">${evento.local}</p>
                </div>

                ${(inscrito.cidade || inscrito.estado || inscrito.pais) ? `
                <div style="margin-bottom: 30px;">
                    <p style="color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; margin-bottom: 5px;">Origem</p>
                    <p style="color: ${secondaryColor}; font-size: 15px; font-weight: 700; margin: 0;">
                        ${inscrito.cidade ? inscrito.cidade : ''}${inscrito.estado ? `, ${inscrito.estado}` : ''}${(inscrito.cidade || inscrito.estado) && inscrito.pais ? ' - ' : ''}${inscrito.pais ? inscrito.pais : ''}
                    </p>
                </div>
                ` : ''}

                <!-- QR Code - Centered in remaining space -->
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-top: 20px;">
                    <div style="padding: 15px; border: 2px solid ${primaryColor}; border-radius: 20px; background: white;">
                        <img src="${qrCodeDataUrl}" style="width: 180px; height: 180px; display: block;" />
                    </div>
                    <p style="color: ${primaryColor}; font-size: 12px; font-weight: 900; margin: 15px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Apresente na Entrada</p>
                </div>
            </div>

            <!-- Footer -->
            <div style="background: #f8fafc; padding: 25px; border-top: 1px solid #eee; text-align: center;">
                <p style="color: #64748b; font-size: 10px; font-weight: 600; margin: 0; line-height: 1.5;">
                    Documento gerado automaticamente pelo Sistema de Gestão de Eventos UNINASSAU.<br/>
                    Emissão: ${new Date().toLocaleString('pt-BR')}
                </p>
            </div>
        </div>
    `;

    await downloadContainerAsImage(container, `comprovante-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}`, onSuccess);
};

const generateCertificate = async (evento: Evento, inscrito: Inscrito, onSuccess?: () => void) => {
    const primaryColor = '#004a99';

    const container = document.createElement('div');
    container.style.cssText = `
        width: 842px;
        height: 595px;
        background: white;
        position: absolute;
        left: -9999px;
        font-family: 'serif', Arial, sans-serif;
        box-sizing: border-box;
        overflow: hidden;
    `;

    container.innerHTML = `
        <div style="width: 100%; height: 100%; border: 20px solid ${primaryColor}; padding: 40px; box-sizing: border-box; position: relative; background: #fffcf5;">
            <!-- Decorative Corners -->
            <div style="position: absolute; top: -10px; left: -10px; width: 100px; height: 100px; border-top: 30px solid white; border-left: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; top: -10px; right: -10px; width: 100px; height: 100px; border-top: 30px solid white; border-right: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; bottom: -10px; left: -10px; width: 100px; height: 100px; border-bottom: 30px solid white; border-left: 30px solid white; pointer-events: none;"></div>
            <div style="position: absolute; bottom: -10px; right: -10px; width: 100px; height: 100px; border-bottom: 30px solid white; border-right: 30px solid white; pointer-events: none;"></div>

            <!-- Content Area -->
            <div style="border: 2px solid ${primaryColor}44; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-radius: 8px; position: relative;">
                
                <!-- Watermark Logo -->
                <img src="${logo}" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; opacity: 0.03; pointer-events: none;" />

                <img src="${logo}" style="height: 70px; margin-bottom: 30px;" />
                
                <h1 style="font-family: 'Times New Roman', serif; font-size: 48px; color: ${primaryColor}; margin: 0 0 10px 0; font-weight: 400; letter-spacing: 2px;">CERTIFICADO</h1>
                <p style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 4px; color: #666; margin-bottom: 40px;">De Participação</p>

                <div style="text-align: center; max-width: 650px; line-height: 1.8; color: #333;">
                    <p style="font-size: 18px; margin: 0;">Certificamos que</p>
                    <p style="font-size: 32px; font-family: 'Times New Roman', serif; font-weight: bold; color: ${primaryColor}; margin: 10px 0;">${inscrito.nomeCompleto.toUpperCase()}</p>
                    <p style="font-size: 18px; margin: 0;">
                        participou do evento <strong style="color: ${primaryColor};">${evento.nome}</strong> 
                        realizado em <strong>${new Date(evento.data).toLocaleDateString('pt-BR')}</strong> 
                        no <strong>${evento.local}</strong>, com registro de presença validado às 
                        ${inscrito.checkinDate ? new Date(inscrito.checkinDate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}.
                    </p>
                </div>

                <div style="margin-top: 50px; width: 100%; display: flex; justify-content: space-between; align-items: flex-end; padding: 0 40px;">
                    <div style="text-align: center;">
                        <div style="width: 200px; border-top: 1px solid #333; margin-bottom: 10px;"></div>
                        <p style="font-size: 10px; font-weight: bold; text-transform: uppercase; margin: 0;">Coordenação de Eventos</p>
                        <p style="font-size: 10px; color: #666; margin: 0;">UNINASSAU</p>
                    </div>

                    <div style="text-align: center;">
                        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">Recife, ${new Date().toLocaleDateString('pt-BR')}</p>
                        <p style="font-size: 8px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Código de Autenticação: ${inscrito.id.substring(0, 8).toUpperCase()}</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    await downloadContainerAsImage(container, `certificado-${inscrito.nomeCompleto.toLowerCase().replace(/\s+/g, '-')}`, onSuccess);
};

export const generateEventRedirectQRCode = async (
    evento: Evento,
    customTexts?: {
        mainTitle?: string;
        subtitle?: string;
        instruction?: string;
        footer?: string;
    },
    onSuccess?: () => void
) => {
    const primaryColor = '#004a99';
    const primaryColorRGB = { r: 0, g: 74, b: 153 }; // RGB for jsPDF
    const secondaryColor = '#333333';

    // Construct the registration URL
    const productionUrl = import.meta.env.VITE_PRODUCTION_URL;
    const baseUrl = productionUrl || (window.location.origin + window.location.pathname);
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    const registrationUrl = `${cleanBaseUrl}#/evento/${evento.id}`;

    console.log('🔗 Generated QR Code URL:', registrationUrl);

    // Default texts (editable)
    const texts = {
        mainTitle: customTexts?.mainTitle || 'Faça sua Inscrição Online!',
        subtitle: customTexts?.subtitle || 'Evento UNINASSAU',
        instruction: customTexts?.instruction || 'Aponte a câmera do seu celular para o QR Code e se inscreva em segundos. Rápido, fácil e seguro!',
        footer: customTexts?.footer || 'Inscrições gratuitas • Vagas limitadas • Garanta sua presença'
    };

    try {
        // Generate QR Code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(registrationUrl, {
            margin: 1,
            width: 600,
            color: {
                dark: primaryColor,
                light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        });

        console.log('✅ QR Code gerado com sucesso!');
        console.log('📊 Tamanho:', qrCodeDataUrl.length, 'caracteres');

        // Create PDF (A4 Portrait: 210mm x 297mm)
        const { jsPDF } = await import('jspdf');
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const pageWidth = 210;
        const pageHeight = 297;
        const margin = 15;

        const isLinkExterno = evento.tipo === 'link_externo';

        // 1. Background
        if (isLinkExterno) {
            doc.setFillColor(255, 255, 255); // White for link_externo
        } else {
            doc.setFillColor(248, 250, 252);
        }
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // 2. Header Section
        if (isLinkExterno) {
            // Gray Header Background
            doc.setFillColor(220, 220, 220);
            doc.rect(0, 0, pageWidth, 40, 'F');

            // Logo Centralizado e com proporção corrigida
            try {
                // Aumentando a altura (de 18 para 28) para não achatar
                const logoW = 50;
                const logoH = 28;
                doc.addImage(logo, 'PNG', pageWidth / 2 - logoW / 2, 6, logoW, logoH);
            } catch (e) {
                console.warn('Logo não carregado:', e);
            }

            // Removida a faixa preta e o texto grande "UNINASSAU"

            let yPos = 60;

            // Title Area (Gray Box)
            doc.setFillColor(235, 235, 235);
            doc.rect(0, yPos - 10, pageWidth, 25, 'F');

            doc.setTextColor(0, 74, 153);
            doc.setFontSize(26);
            doc.setFont('helvetica', 'bold');
            doc.text(texts.mainTitle.toUpperCase(), pageWidth / 2, yPos + 2, { align: 'center' });

            // Accent Line
            doc.setFillColor(0, 74, 153);
            doc.rect(pageWidth / 2 - 12, yPos + 8, 24, 1.2, 'F');

            yPos += 25;

            // Subtitle / High-level Instruction
            doc.setTextColor(60, 60, 60);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            const subLines = doc.splitTextToSize(texts.subtitle.toUpperCase(), pageWidth - 40);
            doc.text(subLines, pageWidth / 2, yPos, { align: 'center' });

            yPos += 15;

            // Optional Divider
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.line(margin + 20, yPos, pageWidth - margin - 20, yPos);

            yPos += 15;

            // Main Instruction Text
            doc.setTextColor(80, 80, 80);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            const instrLines = doc.splitTextToSize(texts.instruction, pageWidth - 40);
            doc.text(instrLines, pageWidth / 2, yPos, { align: 'center' });

            yPos += 15;

            // QR Code
            const qrSize = 75;
            const qrX = pageWidth / 2 - qrSize / 2;
            const qrY = yPos;

            // Borderless QR or light border
            doc.setDrawColor(0, 74, 153);
            doc.setLineWidth(0.8);
            doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 3, 3, 'D');
            doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

            yPos += qrSize + 20;

            // Footer Highlight Box (Gray)
            doc.setFillColor(240, 240, 240);
            const footerBoxHeight = 12;
            doc.rect(pageWidth / 2 - 45, yPos - 8, 90, footerBoxHeight, 'F');

            // Find the highlight part "Garanta 3h complementares"
            // We'll just render it nicely.
            doc.setTextColor(40, 40, 40);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            // Clean emojis for PDF since standard fonts don't support them
            const cleanFooter = texts.footer.replace(/[☑😉]/g, '').trim();
            const footerPart1 = cleanFooter.split('.')[0] + '.';
            const footerPart2 = (cleanFooter.split('.')[1] || '').trim();

            doc.text(footerPart1, pageWidth / 2, yPos, { align: 'center' });

            yPos += 15;

            // Dark Bottom Footer Stripe
            doc.setFillColor(50, 50, 50);
            doc.rect(0, 280, pageWidth, 17, 'F');

            if (footerPart2) {
                doc.setTextColor(255, 255, 255);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(footerPart2, pageWidth / 2, 291, { align: 'center' });
            }

        } else {
            // --- Standard Event Layout (Blue Rounded Boxes) ---
            // Logo
            try {
                doc.addImage(logo, 'PNG', pageWidth / 2 - 25, margin, 50, 20);
            } catch (e) {
                console.warn('Logo não carregado:', e);
            }

            let yPos = margin + 28;

            // Main Title Box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
            doc.setLineWidth(1.5);
            const titleBoxHeight = 35;
            doc.roundedRect(margin, yPos, pageWidth - 2 * margin, titleBoxHeight, 5, 5, 'FD');

            // Main Title
            doc.setTextColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
            doc.setFontSize(24);
            doc.setFont('helvetica', 'bold');
            const titleLines = doc.splitTextToSize(texts.mainTitle.toUpperCase(), pageWidth - 2 * margin - 10);
            doc.text(titleLines, pageWidth / 2, yPos + 12, { align: 'center' });

            // Divider
            doc.setFillColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
            doc.rect(pageWidth / 2 - 10, yPos + 18, 20, 1, 'F');

            // Subtitle
            doc.setFontSize(11);
            doc.setTextColor(51, 51, 51);
            doc.text(texts.subtitle.toUpperCase(), pageWidth / 2, yPos + 26, { align: 'center' });

            yPos += titleBoxHeight + 10;

            // Standard Event Display
            if (evento.tipo !== 'link_externo') {
                // Event Name Box
                doc.setFillColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
                doc.roundedRect(margin, yPos, pageWidth - 2 * margin, 22, 4, 4, 'F');

                doc.setTextColor(255, 255, 255);
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');
                doc.text('NOME DO EVENTO', pageWidth / 2, yPos + 6, { align: 'center' });

                doc.setFontSize(14);
                const eventLines = doc.splitTextToSize(evento.nome, pageWidth - 2 * margin - 10);
                doc.text(eventLines, pageWidth / 2, yPos + 12, { align: 'center' });

                yPos += 28;
            }

            // QR Code Section Box
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(241, 245, 249);
            doc.setLineWidth(0.8);
            const qrBoxHeight = 110;
            doc.roundedRect(margin, yPos, pageWidth - 2 * margin, qrBoxHeight, 5, 5, 'FD');

            // Instruction text
            doc.setTextColor(100, 116, 139);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            const instrLines = doc.splitTextToSize(texts.instruction, pageWidth - 2 * margin - 20);
            doc.text(instrLines, pageWidth / 2, yPos + 8, { align: 'center', maxWidth: pageWidth - 2 * margin - 20 });

            // QR Code
            const qrSize = 65;
            const qrX = pageWidth / 2 - qrSize / 2;
            const qrY = yPos + 18;

            doc.setDrawColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
            doc.setLineWidth(1);
            doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 3, 3, 'D');
            doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

            yPos += qrBoxHeight + 8;

            // Footer section (com quebra de linha automática)
            doc.setFontSize(9);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(primaryColorRGB.r, primaryColorRGB.g, primaryColorRGB.b);
            const footerMaxWidth = pageWidth - 2 * margin - 10;
            const footerLines = doc.splitTextToSize(texts.footer.toUpperCase(), footerMaxWidth);
            doc.text(footerLines, pageWidth / 2, yPos + 5, { align: 'center' });

            const footerHeight = footerLines.length * 4;

            // Bottom info
            doc.setFontSize(7);
            doc.setTextColor(148, 163, 184);
            doc.setFont('helvetica', 'normal');
            doc.text('Sistema de Gestão de Eventos UNINASSAU', pageWidth / 2, yPos + footerHeight + 8, { align: 'center' });
            const eventInfo = `${new Date(evento.data).toLocaleDateString('pt-BR')} às ${evento.horario} • ${evento.local}`;
            doc.text(eventInfo, pageWidth / 2, yPos + footerHeight + 13, { align: 'center' });
        }

        // Save PDF
        const fileName = `qrcode-inscricao-${evento.nome.toLowerCase().replace(/\s+/g, '-')}.pdf`;
        doc.save(fileName);

        console.log('✅ PDF gerado com sucesso:', fileName);

        if (onSuccess) {
            setTimeout(onSuccess, 500);
        }
    } catch (error) {
        console.error('❌ Erro ao gerar PDF:', error);
        alert('Erro ao gerar QR Code. Verifique o console para mais detalhes.');
    }
};

const downloadContainerAsImage = async (container: HTMLElement, fileName: string, onSuccess?: () => void) => {
    document.body.appendChild(container);

    try {
        // Aguardar que todas as imagens sejam carregadas
        const images = container.querySelectorAll('img');
        await Promise.all(
            Array.from(images).map((img) => {
                if (img.complete) return Promise.resolve();
                return new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    // Timeout de segurança
                    setTimeout(resolve, 2000);
                });
            })
        );

        // Aguardar um pouco mais para garantir renderização completa
        await new Promise(resolve => setTimeout(resolve, 300));

        const html2canvas = (await import('html2canvas')).default;
        const canvas = await html2canvas(container, {
            scale: 2,
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0, // Sem timeout para imagens
            removeContainer: false // Não remover container automaticamente
        });

        canvas.toBlob((blob) => {
            if (!blob) {
                console.error('Erro: Blob não gerado');
                return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.png`;
            link.click();

            console.log('✅ QR Code gerado com sucesso:', fileName);

            if (onSuccess) {
                setTimeout(onSuccess, 500);
            }

            setTimeout(() => URL.revokeObjectURL(url), 10000);
        }, 'image/png');
    } catch (error) {
        console.error('❌ Erro ao gerar imagem:', error);
        alert('Erro ao gerar QR Code. Verifique o console para mais detalhes.');
    } finally {
        document.body.removeChild(container);
    }
};

