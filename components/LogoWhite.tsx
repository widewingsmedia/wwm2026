export default function LogoWhite({ width = 160, height = 64, className = '', uid = 'a', animate = false }: { width?: number; height?: number; className?: string; uid?: string; animate?: boolean }) {
  const p = `lw-${uid}-`;
  const svgClassName = [className, animate ? 'lw-assemble' : ''].filter(Boolean).join(' ');
  return (
    <svg className={svgClassName} width={width} height={height} viewBox="0 0 432.3 217.67" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-label="Wide Wings Media">
      <defs>
        <linearGradient id={`${p}g1`} x1="49.91" y1="54.47" x2="118.05" y2="157" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6ba0ba"/><stop offset="1" stopColor="#2e2e62"/>
        </linearGradient>
        <linearGradient id={`${p}g2`} x1="31.88" y1="94.83" x2="122.29" y2="172.59" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcb920"/><stop offset="1" stopColor="#c33b31"/>
        </linearGradient>
        <linearGradient id={`${p}g3`} x1="20.73" y1="64.11" x2="80.68" y2="122.72" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6ba0ba"/><stop offset="1" stopColor="#2e2e62"/>
        </linearGradient>
        <linearGradient id={`${p}g4`} x1="13.4" y1="30.75" x2="73.53" y2="95.85" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcb920"/><stop offset="1" stopColor="#c33b31"/>
        </linearGradient>
        <linearGradient id={`${p}g5`} x1="23.86" y1="12.37" x2="61.83" y2="67.98" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b62d83"/><stop offset="1" stopColor="#571540"/>
        </linearGradient>
        <linearGradient id={`${p}g6`} x1="13.76" y1="110.8" x2="82.93" y2="146.97" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b62d83"/><stop offset="1" stopColor="#571540"/>
        </linearGradient>
        <linearGradient id={`${p}g7`} x1="51.07" y1="151.61" x2="114" y2="173.98" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6ba0ba"/><stop offset="1" stopColor="#2e2e62"/>
        </linearGradient>
        <linearGradient id={`${p}g8`} x1="49.11" y1="199.68" x2="117.37" y2="177.07" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcb920"/><stop offset="1" stopColor="#c33b31"/>
        </linearGradient>
        <linearGradient id={`${p}g9`} x1="25.74" y1="181.97" x2="91.29" y2="181.06" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#b62d83"/><stop offset="1" stopColor="#571540"/>
        </linearGradient>
        <linearGradient id={`${p}g10`} x1="20.36" y1="199.27" x2="51.55" y2="192.04" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcb920"/><stop offset="1" stopColor="#c33b31"/>
        </linearGradient>
        <linearGradient id={`${p}g11`} x1="11.05" y1="168.07" x2="77.95" y2="163.1" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#dcb920"/><stop offset="1" stopColor="#c33b31"/>
        </linearGradient>
        <linearGradient id={`${p}g12`} x1="9.18" y1="147.17" x2="68.23" y2="150.45" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6ba0ba"/><stop offset="1" stopColor="#2e2e62"/>
        </linearGradient>
      </defs>
      <g>
        <polygon fill={`url(#${p}g1)`}  points="127.36 179.6 148.91 179.6 50.53 37.77 50.5 50.44 71.22 80.79 74.23 114.87 127.36 179.6"/>
        <polygon fill={`url(#${p}g2)`}  points="127.36 179.6 31.17 114.7 29.54 72.34 102.63 149.48 127.36 179.6"/>
        <polygon fill={`url(#${p}g3)`}  points="72.92 100.01 19.73 39.8 21.09 87.8 30.41 94.95 29.54 72.34 126.95 179.11 74.23 114.87 72.92 100.01"/>
        <polygon fill={`url(#${p}g4)`}  points="72.92 100.01 71.81 87.45 24.5 27.55 0 31.46 20.04 50.79 19.73 39.8 72.92 100.01"/>
        <polygon fill={`url(#${p}g5)`}  points="24.5 27.55 25.13 0 50.53 37.77 50.5 50.44 71.22 80.79 71.81 87.45 24.5 27.55"/>
        <polygon fill={`url(#${p}g6)`}  points="127.36 179.6 13.2 127.25 2.56 88.2 30.75 103.75 31.17 114.7 127.36 179.6"/>
        <polygon fill={`url(#${p}g7)`}  points="102.21 162.63 52.51 147.25 49.98 153.38 75.02 160.89 78.45 168.5 127.36 179.6 102.21 162.63"/>
        <polygon fill={`url(#${p}g8)`}  points="127.36 179.6 52.57 216.71 54.2 179.82 127.36 179.6"/>
        <polygon fill={`url(#${p}g9)`}  points="53.64 192.34 44.36 193.73 21.36 170.01 85.41 170.08 127.36 179.6 54.2 179.82 53.64 192.34"/>
        <polygon fill={`url(#${p}g10)`} points="53.64 192.34 44.36 193.73 35.71 184.81 28.35 183.46 20.98 213.09 53.2 202.47 53.64 192.34"/>
        <polygon fill={`url(#${p}g11)`} points="27.62 176.47 10.12 175.79 31.33 156.94 64.38 157.7 75.02 160.89 78.45 168.5 85.41 170.08 21.36 170.01 27.62 176.47"/>
        <polygon fill={`url(#${p}g12)`} points="64.38 157.7 31.33 156.94 7.14 155.53 27.91 139.68 52.51 147.25 49.98 153.38 64.38 157.7"/>
        <text fill="#fff" fontFamily="Nexa-Thin, Nexa, Calibri, sans-serif" fontWeight="200" fontSize="82.77" transform="translate(139.87 111.59)">WIDE</text>
        <text fill="#fff" fontFamily="Nexa-Thin, Nexa, Calibri, sans-serif" fontWeight="200" fontSize="28.12" transform="translate(123.81 209.29)">media &amp; advertisement</text>
        <text fill="#fff" fontFamily="Nexa-Bold, Nexa, Calibri, sans-serif" fontWeight="700" fontSize="82.77" transform="translate(141.11 177.97)">WINGS</text>
      </g>
    </svg>
  );
}
