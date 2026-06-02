import{i as e}from"./preload-helper-D2yxXLVK.js";import{x as t}from"./iframe-BUVRcRrU.js";function n({tone:e=`success`,title:t=`Preferences saved`,message:n=`Your notification settings were updated.`}){let r={success:`border-emerald-500/30 bg-emerald-500/10 text-emerald-200`,error:`border-red-500/30 bg-red-500/10 text-red-200`,info:`border-cyan-500/30 bg-cyan-500/10 text-cyan-200`}[e];return(0,a.jsxs)(`div`,{role:`status`,className:`max-w-sm rounded-lg border p-4 shadow-xl ${r}`,children:[(0,a.jsx)(`p`,{className:`m-0 text-sm font-bold`,children:t}),(0,a.jsx)(`p`,{className:`m-0 mt-1 text-sm opacity-80`,children:n})]})}function r({label:e=`Loading dashboard`}){return(0,a.jsxs)(`div`,{className:`flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-4`,children:[(0,a.jsx)(`span`,{className:`h-5 w-5 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent`}),(0,a.jsx)(`span`,{className:`text-sm font-semibold text-white`,children:e})]})}function i({message:e=`Something went wrong.`}){return(0,a.jsxs)(`div`,{role:`alert`,className:`max-w-md rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-red-100`,children:[(0,a.jsx)(`p`,{className:`m-0 text-sm font-bold`,children:`Unable to load this section`}),(0,a.jsx)(`p`,{className:`m-0 mt-1 text-sm opacity-80`,children:e})]})}var a,o,s,c,l,u;e((()=>{a=t(),o={title:`Feedback/States`,parameters:{layout:`centered`},tags:[`autodocs`],argTypes:{tone:{control:`select`,options:[`success`,`error`,`info`]}}},s={render:e=>(0,a.jsx)(n,{...e}),args:{tone:`success`,title:`Goal created`,message:`Your new savings goal is ready.`}},c={render:e=>(0,a.jsx)(r,{...e}),args:{label:`Loading dashboard`}},l={render:e=>(0,a.jsx)(i,{...e}),args:{message:`Try refreshing or contact support if the problem continues.`}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: args => <Toast {...args} />,
  args: {
    tone: 'success',
    title: 'Goal created',
    message: 'Your new savings goal is ready.'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: args => <LoadingState {...args} />,
  args: {
    label: 'Loading dashboard'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <ErrorBoundaryState {...args} />,
  args: {
    message: 'Try refreshing or contact support if the problem continues.'
  }
}`,...l.parameters?.docs?.source}}},u=[`ToastNotification`,`Loading`,`ErrorState`]}))();export{l as ErrorState,c as Loading,s as ToastNotification,u as __namedExportsOrder,o as default};